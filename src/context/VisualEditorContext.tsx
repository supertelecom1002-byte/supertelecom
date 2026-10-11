import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface VisualEditorContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;
  pendingChanges: Record<string, any>;
  savedContent: Record<string, any>;
  updateField: (key: string, value: any) => void;
  getField: (key: string, fallback: string) => string;
  saveAllChanges: () => Promise<boolean>;
  discardChanges: () => void;
  hasChanges: boolean;
  pendingCount: number;
  isSaving: boolean;
}

const VisualEditorContext = createContext<VisualEditorContextType | undefined>(undefined);

const LOCAL_STORAGE_CONTENT_KEY = "st_site_visual_content";

export const VisualEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAdminAuth();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [savedContent, setSavedContent] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load initial content from Supabase & localStorage
  useEffect(() => {
    let mounted = true;

    // Load from local storage immediately for zero-latency hydration
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
      if (cached && mounted) {
        setSavedContent(JSON.parse(cached));
      }
    } catch {
      // ignore
    }

    // Fetch from Supabase site_content
    const fetchContent = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("*")
          .eq("key", "main_content")
          .maybeSingle();

        if (!error && data && mounted) {
          const contentObj =
            typeof data.content === "object" && data.content !== null ? data.content : {};
          const merged = {
            hero_title: data.hero_title || contentObj.hero_title,
            hero_subtitle: data.hero_subtitle || contentObj.hero_subtitle,
            hero_description: data.hero_description || contentObj.hero_description,
            cta_text: data.cta_text || contentObj.cta_text,
            shop_phone: data.shop_phone || contentObj.shop_phone,
            shop_address: data.shop_address || contentObj.shop_address,
            shop_timings: data.shop_timings || contentObj.shop_timings,
            ...(data.custom_fields || contentObj.custom_fields || contentObj || {}),
          };

          setSavedContent((prev) => {
            const next = { ...prev, ...merged };
            try {
              localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(next));
            } catch {
              // ignore
            }
            return next;
          });
        }
      } catch {
        // Safe silent fallback to local storage or defaults
      }
    };

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []);

  // Check URL param ?edit=true to enable edit mode automatically if admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("edit") === "true") {
        if (isAdmin) {
          setIsEditMode(true);
        }
      }
    }
  }, [isAdmin]);

  // Turn off edit mode if admin logs out
  useEffect(() => {
    if (!isAdmin) {
      setIsEditMode(false);
    }
  }, [isAdmin]);

  const toggleEditMode = () => {
    if (!isAdmin) return;
    setIsEditMode((prev) => !prev);
  };

  const setEditMode = (value: boolean) => {
    if (!isAdmin && value) return;
    setIsEditMode(value);
  };

  const updateField = (key: string, value: any) => {
    setPendingChanges((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getField = (key: string, fallback: string): string => {
    if (key in pendingChanges) {
      return pendingChanges[key];
    }
    if (key in savedContent && savedContent[key] !== undefined && savedContent[key] !== null) {
      return savedContent[key];
    }
    return fallback;
  };

  const discardChanges = () => {
    setPendingChanges({});
  };

  const saveAllChanges = async (): Promise<boolean> => {
    if (Object.keys(pendingChanges).length === 0) return true;

    setIsSaving(true);
    try {
      const updatedContent = {
        ...savedContent,
        ...pendingChanges,
      };

      // Save to localStorage for instant client persistence
      try {
        localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(updatedContent));
      } catch {
        // ignore
      }

      // Upsert to Supabase site_content table
      const payload: Record<string, any> = {
        key: "main_content",
        section: "global",
        content: updatedContent,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("site_content").upsert([payload]);
      if (error) {
        console.warn("Supabase site_content save warning:", error.message);
      }

      setSavedContent(updatedContent);
      setPendingChanges({});
      return true;
    } catch (err) {
      console.error("Failed to save changes:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;
  const pendingCount = Object.keys(pendingChanges).length;

  return (
    <VisualEditorContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        setEditMode,
        pendingChanges,
        savedContent,
        updateField,
        getField,
        saveAllChanges,
        discardChanges,
        hasChanges,
        pendingCount,
        isSaving,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
};

export const useVisualEditor = () => {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error("useVisualEditor must be used within a VisualEditorProvider");
  }
  return context;
};

export default VisualEditorContext;
