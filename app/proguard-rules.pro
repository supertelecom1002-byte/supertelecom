# Proguard rules for Cyber Gaming OS Launcher
-keep class com.supertelecom.gamingos.** { *; }
-keepclassmembers class * {
    @androidx.compose.runtime.Composable *;
}
