import React, { Suspense, lazy } from "react";
import type { ToolId } from "@/data/labToolsRegistry";

const SpeakerCleanerModal = lazy(() =>
  import("@/components/tools/SpeakerCleanerModal").then((m) => ({ default: m.SpeakerCleanerModal }))
);
const AudioHardwareTestModal = lazy(() =>
  import("@/components/tools/AudioHardwareTestModal").then((m) => ({ default: m.AudioHardwareTestModal }))
);
const VibrationTesterModal = lazy(() =>
  import("@/components/tools/VibrationTesterModal").then((m) => ({ default: m.VibrationTesterModal }))
);
const TouchTestModal = lazy(() =>
  import("@/components/tools/TouchTestModal").then((m) => ({ default: m.TouchTestModal }))
);
const DeadPixelTestModal = lazy(() =>
  import("@/components/tools/DeadPixelTestModal").then((m) => ({ default: m.DeadPixelTestModal }))
);
const MultiTouchTesterModal = lazy(() =>
  import("@/components/tools/MultiTouchTesterModal").then((m) => ({ default: m.MultiTouchTesterModal }))
);
const BurnInHealerModal = lazy(() =>
  import("@/components/tools/BurnInHealerModal").then((m) => ({ default: m.BurnInHealerModal }))
);
const DisplayFpsMeterModal = lazy(() =>
  import("@/components/tools/DisplayFpsMeterModal").then((m) => ({ default: m.DisplayFpsMeterModal }))
);
const GyroCompassModal = lazy(() =>
  import("@/components/tools/GyroCompassModal").then((m) => ({ default: m.GyroCompassModal }))
);
const TorchControllerModal = lazy(() =>
  import("@/components/tools/TorchControllerModal").then((m) => ({ default: m.TorchControllerModal }))
);
const AmbientLightTestModal = lazy(() =>
  import("@/components/tools/AmbientLightTestModal").then((m) => ({ default: m.AmbientLightTestModal }))
);
const AntiTheftModal = lazy(() =>
  import("@/components/tools/AntiTheftModal").then((m) => ({ default: m.AntiTheftModal }))
);
const BatteryGuardModal = lazy(() =>
  import("@/components/tools/BatteryGuardModal").then((m) => ({ default: m.BatteryGuardModal }))
);
const SecretCodesModal = lazy(() =>
  import("@/components/tools/SecretCodesModal").then((m) => ({ default: m.SecretCodesModal }))
);
const ImeiValidatorModal = lazy(() =>
  import("@/components/tools/ImeiValidatorModal").then((m) => ({ default: m.ImeiValidatorModal }))
);
const LockScreenGenModal = lazy(() =>
  import("@/components/tools/LockScreenGenModal").then((m) => ({ default: m.LockScreenGenModal }))
);
const UsedPhoneAuditModal = lazy(() =>
  import("@/components/tools/UsedPhoneAuditModal").then((m) => ({ default: m.UsedPhoneAuditModal }))
);
const WaterRescueWizardModal = lazy(() =>
  import("@/components/tools/WaterRescueWizardModal").then((m) => ({ default: m.WaterRescueWizardModal }))
);
const PowerTelemetryModal = lazy(() =>
  import("@/components/tools/PowerTelemetryModal").then((m) => ({ default: m.PowerTelemetryModal }))
);

interface LazyToolModalRendererProps {
  activeModal: ToolId | null;
  onClose: () => void;
  onSelectTool: (id: ToolId) => void;
}

/** Lazily loads and renders only the currently active diagnostic tool modal. */
export const LazyToolModalRenderer: React.FC<LazyToolModalRendererProps> = ({
  activeModal,
  onClose,
  onSelectTool,
}) => {
  if (!activeModal) return null;

  return (
    <Suspense fallback={null}>
      {activeModal === "speaker_cleaner" && <SpeakerCleanerModal isOpen onClose={onClose} />}
      {activeModal === "audio_test" && <AudioHardwareTestModal isOpen onClose={onClose} />}
      {activeModal === "vibration_test" && <VibrationTesterModal isOpen onClose={onClose} />}
      {activeModal === "touch_test" && <TouchTestModal isOpen onClose={onClose} />}
      {activeModal === "dead_pixel" && <DeadPixelTestModal isOpen onClose={onClose} />}
      {activeModal === "multi_touch" && <MultiTouchTesterModal isOpen onClose={onClose} />}
      {activeModal === "burnin_healer" && <BurnInHealerModal isOpen onClose={onClose} />}
      {activeModal === "fps_meter" && <DisplayFpsMeterModal isOpen onClose={onClose} />}
      {activeModal === "gyro" && <GyroCompassModal isOpen onClose={onClose} />}
      {activeModal === "torch" && <TorchControllerModal isOpen onClose={onClose} />}
      {activeModal === "ambient_light" && <AmbientLightTestModal isOpen onClose={onClose} />}
      {activeModal === "anti_theft" && <AntiTheftModal isOpen onClose={onClose} />}
      {activeModal === "battery_guard" && <BatteryGuardModal isOpen onClose={onClose} />}
      {activeModal === "secret_codes" && <SecretCodesModal isOpen onClose={onClose} />}
      {activeModal === "imei_validator" && <ImeiValidatorModal isOpen onClose={onClose} />}
      {activeModal === "lockscreen_gen" && <LockScreenGenModal isOpen onClose={onClose} />}
      {activeModal === "used_phone_audit" && <UsedPhoneAuditModal isOpen onClose={onClose} />}
      {activeModal === "water_wizard" && (
        <WaterRescueWizardModal
          isOpen
          onClose={onClose}
          onOpenSpeakerEjector={() => onSelectTool("speaker_cleaner")}
        />
      )}
      {activeModal === "doctor_diagnostic" && <PowerTelemetryModal isOpen onClose={onClose} />}
    </Suspense>
  );
};

export default LazyToolModalRenderer;
