package com.supertelecom.gamingos.service

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import androidx.core.app.NotificationCompat
import com.supertelecom.gamingos.MainActivity
import com.supertelecom.gamingos.R

class FloatingCrosshairService : Service() {

    private var windowManager: WindowManager? = null
    private var crosshairView: CrosshairOverlayView? = null
    private var layoutParams: WindowManager.LayoutParams? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        isRunning = true
        startForegroundNotification()
        setupFloatingOverlay()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopSelf()
            return START_NOT_STICKY
        }
        return START_STICKY
    }

    private fun startForegroundNotification() {
        val channelId = "cyber_gaming_crosshair_channel"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Cyber HUD Crosshair Overlay",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Active floating tactical crosshair for high-FPS mobile gaming"
            }
            notificationManager.createNotificationChannel(channel)
        }

        val launchIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val stopIntent = Intent(this, FloatingCrosshairService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(
            this,
            1,
            stopIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Cyber HUD Crosshair Active")
            .setContentText("Tactical overlay positioned on screen. Tap to configure.")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentIntent(pendingIntent)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Turn Off", stopPendingIntent)
            .setOngoing(true)
            .build()

        startForeground(NOTIFICATION_ID, notification)
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setupFloatingOverlay() {
        if (!Settings.canDrawOverlays(this)) {
            stopSelf()
            return
        }

        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val overlayType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val sizePx = (CROSSHAIR_SIZE_DP * resources.displayMetrics.density).toInt()

        layoutParams = WindowManager.LayoutParams(
            sizePx,
            sizePx,
            overlayType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.CENTER
            x = 0
            y = 0
        }

        crosshairView = CrosshairOverlayView(this).apply {
            var initialX = 0
            var initialY = 0
            var initialTouchX = 0f
            var initialTouchY = 0f

            setOnTouchListener { _, event ->
                val params = this@FloatingCrosshairService.layoutParams ?: return@setOnTouchListener false
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = params.x
                        initialY = params.y
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        true
                    }
                    MotionEvent.ACTION_MOVE -> {
                        params.x = initialX + (event.rawX - initialTouchX).toInt()
                        params.y = initialY + (event.rawY - initialTouchY).toInt()
                        windowManager?.updateViewLayout(this, params)
                        true
                    }
                    else -> false
                }
            }
        }

        try {
            windowManager?.addView(crosshairView, layoutParams)
        } catch (_: Exception) {
            stopSelf()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        if (crosshairView != null && windowManager != null) {
            try {
                windowManager?.removeView(crosshairView)
            } catch (_: Exception) {
                // View already removed
            }
            crosshairView = null
        }
    }

    // Custom View to render neon tactical crosshair
    private class CrosshairOverlayView(context: Context) : View(context) {

        private val ringPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#00F0FF")
            style = Paint.Style.STROKE
            strokeWidth = 3f
        }

        private val dotPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#00FF88")
            style = Paint.Style.FILL
        }

        private val linePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#00F0FF")
            style = Paint.Style.STROKE
            strokeWidth = 3.5f
            strokeCap = Paint.Cap.ROUND
        }

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            val cx = width / 2f
            val cy = height / 2f
            val radius = width * 0.35f

            // Outer tactical ring
            canvas.drawCircle(cx, cy, radius, ringPaint)

            // Center neon dot
            canvas.drawCircle(cx, cy, 4f, dotPaint)

            // 4 Cross lines with gap in center
            val gap = 12f
            val lineLen = width * 0.42f

            // Top
            canvas.drawLine(cx, cy - gap, cx, cy - lineLen, linePaint)
            // Bottom
            canvas.drawLine(cx, cy + gap, cx, cy + lineLen, linePaint)
            // Left
            canvas.drawLine(cx - gap, cy, cx - lineLen, cy, linePaint)
            // Right
            canvas.drawLine(cx + gap, cy, cx + lineLen, cy, linePaint)
        }
    }

    companion object {
        const val NOTIFICATION_ID = 2026
        const val ACTION_STOP = "com.supertelecom.gamingos.STOP_CROSSHAIR"
        const val CROSSHAIR_SIZE_DP = 72

        @Volatile
        var isRunning: Boolean = false

        fun start(context: Context) {
            val intent = Intent(context, FloatingCrosshairService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            val intent = Intent(context, FloatingCrosshairService::class.java).apply {
                action = ACTION_STOP
            }
            context.startService(intent)
        }
    }
}
