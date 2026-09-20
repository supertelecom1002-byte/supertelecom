import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("*")
          .eq("id", "main_content")
          .maybeSingle();

        if (!error && data && mounted) {
          const merged = {
            hero_title: data.hero_title,
            hero_subtitle: data.hero_subtitle,
            hero_description: data.hero_description,
            cta_text: data.cta_text,
            shop_phone: data.shop_phone,
            shop_address: data.shop_address,
            shop_timings: data.shop_timings,
            ...(data.custom_fields || {}),
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
      } catch (err) {
        console.warn("VisualEditorContext content fetch warning:", err);
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
        id: "main_content",
        updated_at: new Date().toISOString(),
        custom_fields: updatedContent,
      };

      // Map well-known fields if present
      if (updatedContent.hero_title) payload.hero_title = updatedContent.hero_title;
      if (updatedContent.hero_subtitle) payload.hero_subtitle = updatedContent.hero_subtitle;
      if (updatedContent.hero_description) payload.hero_description = updatedContent.hero_description;
      if (updatedContent.cta_text) payload.cta_text = updatedContent.cta_text;
      if (updatedContent.shop_phone || updatedContent.contact_phone) {
        payload.shop_phone = updatedContent.contact_phone || updatedContent.shop_phone;
      }
      if (updatedContent.shop_address || updatedContent.contact_address) {
        payload.shop_address = updatedContent.contact_address || updatedContent.shop_address;
      }
      if (updatedContent.shop_timings || updatedContent.contact_timings) {
        payload.shop_timings = updatedContent.contact_timings || updatedContent.shop_timings;
      }

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
