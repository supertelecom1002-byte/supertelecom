package com.supertelecom.gamingos.telemetry

import android.app.ActivityManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.display.DisplayManager
import android.os.BatteryManager
import android.os.Build
import android.os.PowerManager
import android.view.Display
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale

data class HardwareTelemetryState(
    val batteryPercent: Int = 100,
    val batteryTempCelsius: Float = 32.0f,
    val isCharging: Boolean = false,
    val totalRamGb: Float = 8.0f,
    val usedRamGb: Float = 3.5f,
    val ramUsagePercent: Int = 44,
    val displayRefreshRateHz: Int = 120,
    val thermalStatus: String = "OPTIMAL",
    val isThermalThrottling: Boolean = false
)

class HardwareTelemetryManager(private val context: Context) {

    private val _telemetryState = MutableStateFlow(HardwareTelemetryState())
    val telemetryState: StateFlow<HardwareTelemetryState> = _telemetryState.asStateFlow()

    private val activityManager =
        context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
    private val powerManager =
        context.getSystemService(Context.POWER_SERVICE) as? PowerManager

    private val batteryReceiver = object : BroadcastReceiver() {
        override fun onReceive(c: Context?, intent: Intent?) {
            if (intent?.action == Intent.ACTION_BATTERY_CHANGED) {
                updateBatteryAndSystem(intent)
            }
        }
    }

    fun startListening() {
        val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val initialIntent = context.registerReceiver(batteryReceiver, filter)
        if (initialIntent != null) {
            updateBatteryAndSystem(initialIntent)
        } else {
            pollSystemMetrics()
        }
    }

    fun stopListening() {
        try {
            context.unregisterReceiver(batteryReceiver)
        } catch (_: Exception) {
            // ignore if not registered
        }
    }

    fun pollSystemMetrics() {
        val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryIntent = context.registerReceiver(null, filter)
        updateBatteryAndSystem(batteryIntent)
    }

    private fun updateBatteryAndSystem(batteryIntent: Intent?) {
        // 1. Real Battery Level & Temperature
        val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: 100
        val scale = batteryIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: 100
        val batteryPct = if (level >= 0 && scale > 0) {
            ((level / scale.toFloat()) * 100).toInt()
        } else 100

        val rawTemp = batteryIntent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 320) ?: 320
        val tempCelsius = rawTemp / 10.0f

        val status = batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL

        // 2. Real RAM Usage
        var totalGb = 8.0f
        var usedGb = 3.5f
        var ramPct = 44
        if (activityManager != null) {
            val memInfo = ActivityManager.MemoryInfo()
            activityManager.getMemoryInfo(memInfo)
            val totalBytes = memInfo.totalMem.toFloat()
            val availBytes = memInfo.availMem.toFloat()
            val usedBytes = (totalBytes - availBytes).coerceAtLeast(0f)

            totalGb = String.format(Locale.US, "%.1f", totalBytes / (1024f * 1024f * 1024f)).toFloat()
            usedGb = String.format(Locale.US, "%.1f", usedBytes / (1024f * 1024f * 1024f)).toFloat()
            ramPct = if (totalBytes > 0) {
                ((usedBytes / totalBytes) * 100).toInt()
            } else 40
        }

        // 3. Real Display Refresh Rate
        val refreshRate = getRealDisplayRefreshRate()

        // 4. Real Thermal Status
        var thermalStatusText = "OPTIMAL"
        var isThrottling = false
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && powerManager != null) {
            when (powerManager.currentThermalStatus) {
                PowerManager.THERMAL_STATUS_NONE -> thermalStatusText = "COOL"
                PowerManager.THERMAL_STATUS_LIGHT -> thermalStatusText = "NORMAL"
                PowerManager.THERMAL_STATUS_MODERATE -> thermalStatusText = "WARM"
                PowerManager.THERMAL_STATUS_SEVERE -> {
                    thermalStatusText = "THROTTLED"
                    isThrottling = true
                }
                PowerManager.THERMAL_STATUS_CRITICAL,
                PowerManager.THERMAL_STATUS_EMERGENCY,
                PowerManager.THERMAL_STATUS_SHUTDOWN -> {
                    thermalStatusText = "CRITICAL"
                    isThrottling = true
                }
            }
        }

        _telemetryState.value = HardwareTelemetryState(
            batteryPercent = batteryPct,
            batteryTempCelsius = tempCelsius,
            isCharging = isCharging,
            totalRamGb = totalGb,
            usedRamGb = usedGb,
            ramUsagePercent = ramPct,
            displayRefreshRateHz = refreshRate,
            thermalStatus = thermalStatusText,
            isThermalThrottling = isThrottling
        )
    }

    private fun getRealDisplayRefreshRate(): Int {
        return try {
            val displayManager = context.getSystemService(Context.DISPLAY_SERVICE) as? DisplayManager
            val defaultDisplay = displayManager?.getDisplay(Display.DEFAULT_DISPLAY)
            val rate = defaultDisplay?.refreshRate ?: 60f
            rate.toInt().coerceAtLeast(60)
        } catch (_: Exception) {
            60
        }
    }
}
