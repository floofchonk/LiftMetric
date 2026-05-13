import { useEntity } from "./useEntity";
import { brandSettingsEntityConfig } from "../entities/BrandSettings";
import { useAuthContext } from "../lib/AuthContext";

type BrandSettings = {
  id: number;
  userId: string;
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  isActive: string;
  created_at: string;
  updated_at: string;
};

export function useBrandSettings() {
  const { currentUser } = useAuthContext();
  const { items: settings, loading, create, update } = useEntity<BrandSettings>(brandSettingsEntityConfig);
  
  const userSettings = settings.find(s => s.userId === currentUser?.id && s.isActive === "true");

  return {
    settings: userSettings,
    loading,
    create,
    update,
  };
}
