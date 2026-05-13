import { useState, useEffect } from "react";
import { useEntity } from "./useEntity";
import { userEntityConfig } from "../entities/User";

type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  subscriptionPlan: "free" | "professional" | "enterprise";
  subscriptionStatus: "active" | "canceled" | "expired" | "trial";
  billingCycle: "monthly" | "annual";
  nextBillingDate: string;
  trialEndsAt: string;
  created_at: string;
  updated_at: string;
};

export type AuthUser = Omit<User, "password">;

export function useAuth() {
  const { items: users, loading, error, create, update } = useEntity<User>(userEntityConfig);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored session
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId && users.length > 0) {
      const user = users.find((u) => String(u.id) === storedUserId);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        setIsAuthenticated(true);
      }
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = users.find((u) => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("currentUserId", String(user.id));
      return { success: true };
    }
    
    return { success: false, error: "Invalid email or password" };
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    try {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14 day trial

      const nextBillingDate = new Date(trialEndsAt);
      nextBillingDate.setDate(nextBillingDate.getDate() + 1);

      await create({
        email,
        password, // In production, this should be hashed
        name,
        subscriptionPlan: "free",
        subscriptionStatus: "trial",
        billingCycle: "monthly",
        nextBillingDate: nextBillingDate.toISOString(),
        trialEndsAt: trialEndsAt.toISOString(),
      });

      // Find the newly created user
      const newUser = users.find((u) => u.email === email);
      if (newUser) {
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem("currentUserId", String(newUser.id));
        return { success: true };
      }

      return { success: false, error: "Failed to create account" };
    } catch (err) {
      return { success: false, error: "Registration failed" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUserId");
  };

  const updateUserSubscription = async (
    plan: "free" | "professional" | "enterprise",
    billingCycle: "monthly" | "annual"
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "No user logged in" };
    }

    try {
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + (billingCycle === "annual" ? 12 : 1));

      await update(currentUser.id, {
        subscriptionPlan: plan,
        subscriptionStatus: "active",
        billingCycle,
        nextBillingDate: nextBillingDate.toISOString(),
      });

      const updatedUserData = users.find(u => u.id === currentUser.id);
      if (updatedUserData) {
        const { password: _, ...userWithoutPassword } = updatedUserData;
        setCurrentUser(userWithoutPassword);
        return { success: true };
      }

      return { success: false, error: "Failed to update subscription" };
    } catch (err) {
      return { success: false, error: "Update failed" };
    }
  };

  return {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUserSubscription,
  };
}
