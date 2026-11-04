package com.supertelecom.feature.more

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.BatteryManager
import android.os.Build
import android.os.Environment
import android.os.StatFs
import android.provider.Settings
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.HomeLauncherActivity
import com.supertelecom.R
import com.supertelecom.feature.launcher.AppRepository
import com.supertelecom.feature.update.AppUpdateManager
import com.supertelecom.model.AppItem
import com.supertelecom.model.NavTab
import com.supertelecom.theme.*

@Composable
fun MoreFeaturesScreen(
    isHindi: Boolean,
    onToggleLanguage: () -> Unit,
    allApps: List<AppItem>,
    isDefaultLauncher: Boolean,
    appRepository: AppRepository,
    onNavigateTab: (NavTab) -> Unit,
    contentPadding: PaddingValues = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 120.dp)
) {
    val context = LocalContext.current
    val activity = context as? Activity

    val updateManager = remember { AppUpdateManager.getInstance(context) }
    val updateMetadata by updateManager.updateMetadata.collectAsState()
    val isDownloadingUpdate by updateManager.isDownloading.collectAsState()
    val downloadProgress by updateManager.downloadProgress.collectAsState()
    val updateStatusMsg by updateManager.statusMessage.collectAsState()
    val isCheckingUpdate by updateManager.isChecking.collectAsState()

    var showPrivacyDialog by remember { mutableStateOf(false) }
    var showGrievanceDialog by remember { mutableStateOf(false) }

    // Read real device hardware & battery stats
    val (batteryPercent, isCharging) = remember {
        try {
            val iFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
            val batteryStatus = context.registerReceiver(null, iFilter)
            val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
            val status = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
            val charging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                    status == BatteryManager.BATTERY_STATUS_FULL
            val percent = if (level >= 0 && scale > 0) (level * 100 / scale) else -1
            Pair(percent, charging)
        } catch (_: Exception) {
            Pair(-1, false)
        }
    }

    val (freeStorageGb, totalStorageGb) = remember {
        try {
            val stat = StatFs(Environment.getDataDirectory().path)
            val bytesAvailable = stat.availableBlocksLong * stat.blockSizeLong
            val bytesTotal = stat.blockCountLong * stat.blockSizeLong
            val freeGb = bytesAvailable.toDouble() / (1024 * 1024 * 1024)
            val totalGb = bytesTotal.toDouble() / (1024 * 1024 * 1024)
            Pair(freeGb, totalGb)
        } catch (_: Exception) {
            Pair(-1.0, -1.0)
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .statusBarsPadding(),
        contentPadding = contentPadding
    ) {
        item {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = if (isHindi) "अन्य सुविधाएं व सेटिंग्स" else "More Features & Settings",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = TextPrimary,
                            fontSize = 20.sp
                        )
                    )
                    Text(
                        text = if (isHindi) "लॉन्चर • डायग्नोस्टिक्स • रिपेयर • प्राइवेसी" else "Launcher • Diagnostics • Repair • Privacy",
                        style = MaterialTheme.typography.labelSmall.copy(color = CyanAccent)
                    )
                }

                Button(
                    onClick = onToggleLanguage,
                    colors = ButtonDefaults.buttonColors(containerColor = CardDark),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .height(38.dp)
                        .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Translate,
                        contentDescription = null,
                        tint = CyanAccent,
                        modifier = Modifier.size(15.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (isHindi) "ENG" else "हिंदी",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ── GROUP 1: SUPER LAUNCHER & PHONE MANAGEMENT ──
            SectionHeader(
                title = if (isHindi) "फोन मैनेजमेंट (सुपर लॉन्चर)" else "Phone Management (Super Launcher)",
                icon = Icons.Default.Smartphone
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (isHindi) "सुपर लॉन्चर (Super Launcher)" else "Super Launcher Suite",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                            )
                            Text(
                                text = if (isHindi)
                                    "4 थीम्स (Minimal, iOS-Style, Pixel, Classic) • ${allApps.size} ऐप्स लोड"
                                else
                                    "4 clean themes (Minimal, iOS-Style, Pixel, Classic) • ${allApps.size} apps",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = TextSecondary,
                                    fontSize = 12.sp
                                )
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    if (isDefaultLauncher) EmeraldAccent.copy(alpha = 0.2f)
                                    else CardBorder
                                )
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = if (isDefaultLauncher)
                                    (if (isHindi) "सक्रिय डिफ़ॉल्ट" else "ACTIVE DEFAULT")
                                else
                                    (if (isHindi) "वैकल्पिक" else "STANDALONE"),
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = if (isDefaultLauncher) EmeraldAccent else TextMuted,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 10.sp
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = {
                                val launcherIntent = Intent(context, HomeLauncherActivity::class.java).apply {
                                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                }
                                context.startActivity(launcherIntent)
                            },
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = CyanAccent,
                                contentColor = BgDark
                            )
                        ) {
                            Icon(Icons.Default.Launch, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "लॉन्चर खोलें" else "OPEN LAUNCHER",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }

                        OutlinedButton(
                            onClick = {
                                if (activity != null) {
                                    appRepository.requestDefaultLauncherRole(activity)
                                }
                            },
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp),
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary)
                        ) {
                            Icon(Icons.Default.Home, contentDescription = null, modifier = Modifier.size(16.dp), tint = TextSecondary)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "डिफ़ॉल्ट सेट करें" else "SET DEFAULT",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                    }

                    if (isDefaultLauncher) {
                        Spacer(modifier = Modifier.height(8.dp))
                        TextButton(
                            onClick = {
                                if (activity != null) {
                                    appRepository.openHomeSettings(activity)
                                }
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = if (isHindi) "पुराना ओरिजिनल लॉन्चर रीस्टोर करें" else "Restore Original System Launcher",
                                color = TextMuted,
                                style = MaterialTheme.typography.labelSmall
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ── GROUP 2: DEVICE DIAGNOSTICS & HARDWARE ──
            SectionHeader(
                title = if (isHindi) "डिवाइस डायग्नोस्टिक्स व हार्डवेयर" else "Device Diagnostics & Hardware",
                icon = Icons.Default.Analytics
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    InfoRow(
                        label = if (isHindi) "डिवाइस मॉडल" else "Device Model",
                        value = "${Build.MANUFACTURER.replaceFirstChar { it.uppercase() }} ${Build.MODEL}"
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    InfoRow(
                        label = if (isHindi) "एंड्रॉइड वर्शन" else "Android Version",
                        value = "Android ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})"
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    InfoRow(
                        label = if (isHindi) "बैटरी स्टेटस" else "Battery Status",
                        value = if (batteryPercent >= 0) {
                            "$batteryPercent% ${if (isCharging) "⚡ (Charging)" else "🔋 (Discharging)"}"
                        } else {
                            "Status Active"
                        }
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    InfoRow(
                        label = if (isHindi) "इंटरनल स्टोरेज" else "Internal Storage",
                        value = if (freeStorageGb >= 0 && totalStorageGb >= 0) {
                            "%.1f GB free of %.1f GB".format(freeStorageGb, totalStorageGb)
                        } else {
                            "Storage Available"
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ── GROUP 3: FLAGSHIP REPAIR SUPPORT (GIRIDIH) ──
            SectionHeader(
                title = if (isHindi) "सुपर टेलीकॉम रिपेयर लैब सपोर्ट" else "Flagship Lab Repair Support",
                icon = Icons.Default.Build
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Image(
                            painter = painterResource(id = R.drawable.super_telecom_logo),
                            contentDescription = "Super Telecom Logo",
                            modifier = Modifier
                                .height(32.dp)
                                .clip(RoundedCornerShape(6.dp))
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "SUPER TELECOM (Est. 2016)",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Black,
                                    color = TextPrimary
                                )
                            )
                            Text(
                                text = if (isHindi) "बरगंडा रोड (शिवम क्लिनिक के पास), गिरिडीह" else "Barganda Road, Near Shivam Clinic, Giridih",
                                style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 11.sp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = if (isHindi)
                            "परामर्श आधारित सेवा: चिप-लेवल मदरबोर्ड रिपेयर, कर्व्ड AMOLED ग्लास रिप्लेसमेंट, CPU रीबॉलिंग और वाटर डैमेज रिवाइवल। लैब में मुफ्त डायग्नोस्टिक्स उपलब्ध है।"
                        else
                            "Consultation-based repair: Chip-level motherboard micro-soldering, curved AMOLED glass replacement, CPU reballing & water damage revival. Free inspection at lab.",
                        style = MaterialTheme.typography.bodySmall.copy(color = TextMuted, fontSize = 12.sp)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = {
                                val url = "https://wa.me/918002903643?text=" + Uri.encode("Hello Super Telecom, I need consultation for my device.")
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                }
                                try {
                                    context.startActivity(intent)
                                } catch (_: Exception) {}
                            },
                            modifier = Modifier
                                .weight(1f)
                                .height(50.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = EmeraldAccent,
                                contentColor = BgDark
                            )
                        ) {
                            Icon(Icons.Default.Chat, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "वॉट्सऐप परामर्श" else "WHATSAPP",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }

                        Button(
                            onClick = {
                                val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:+918002903643")).apply {
                                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                }
                                try {
                                    context.startActivity(intent)
                                } catch (_: Exception) {}
                            },
                            modifier = Modifier
                                .weight(1f)
                                .height(50.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = CyanAccent,
                                contentColor = BgDark
                            )
                        ) {
                            Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "कॉल करें" else "CALL NOW",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ── GROUP 4: PRIVACY & YOUR DATA CONTROLS ──
            SectionHeader(
                title = if (isHindi) "प्राइवेसी और आपके डेटा अधिकार" else "Privacy & Your Data Controls",
                icon = Icons.Default.Shield
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(34.dp)
                                    .background(EmeraldAccent.copy(alpha = 0.15f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Lock, contentDescription = null, tint = EmeraldAccent, modifier = Modifier.size(18.dp))
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = if (isHindi) "100% ऑन-डिवाइस आर्किटेक्चर" else "100% On-Device Architecture",
                                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, color = TextPrimary)
                                )
                                Text(
                                    text = if (isHindi) "कोई रिमोट क्लाउड नहीं • 0 ट्रैकिंग" else "Zero remote servers • Zero tracking",
                                    style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent)
                                )
                            }
                        }

                        TextButton(onClick = { showPrivacyDialog = true }) {
                            Text(
                                text = if (isHindi) "विस्तार देखें" else "Details",
                                color = CyanAccent,
                                style = MaterialTheme.typography.labelMedium
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = if (isHindi)
                            "सभी फाइल ट्रांसफर डायरेक्ट वाई-फाई सॉकेट पर चलते हैं और रिकवरी केवल आपके फोन के लोकल स्टोरेज में काम करती है। किसी भी फाइल की कॉपी बाहरी सर्वर पर नहीं जाती।"
                        else
                            "Transfers run directly phone-to-phone over local Wi-Fi sockets. Media scans execute strictly on local device storage. Zero bytes are uploaded remotely.",
                        style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary, fontSize = 12.sp)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = {
                                val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                                    data = Uri.fromParts("package", context.packageName, null)
                                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                }
                                try {
                                    context.startActivity(intent)
                                } catch (_: Exception) {}
                            },
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp),
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary)
                        ) {
                            Icon(Icons.Default.Security, contentDescription = null, modifier = Modifier.size(15.dp), tint = TextSecondary)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "अनुमतियां प्रबंधित करें" else "MANAGE PERMISSIONS",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                            )
                        }

                        OutlinedButton(
                            onClick = { showGrievanceDialog = true },
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp),
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary)
                        ) {
                            Icon(Icons.Default.Mail, contentDescription = null, modifier = Modifier.size(15.dp), tint = TextSecondary)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "शिकायत अधिकारी" else "GRIEVANCE OFFICER",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ── GROUP 5: APP VERSION & UPDATE ──
            SectionHeader(
                title = if (isHindi) "ऐप वर्शन व अपडेट स्थिति" else "App Version & In-Place Update",
                icon = Icons.Default.Info
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Super Telecom Android",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = TextPrimary)
                            )
                            Text(
                                text = "v2.7.0 (Build 27) • Official Release",
                                style = MaterialTheme.typography.labelSmall.copy(color = CyanAccent)
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(CyanAccent.copy(alpha = 0.15f))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "PACKAGE: com.supertelecom.app",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CyanAccent,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    if (isCheckingUpdate) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            CircularProgressIndicator(modifier = Modifier.size(16.dp), color = CyanAccent, strokeWidth = 2.dp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isHindi) "अपडेट की जांच हो रही है..." else "Checking for updates...",
                                style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary)
                            )
                        }
                    } else if (updateMetadata != null) {
                        val meta = updateMetadata!!
                        Column {
                            Text(
                                text = if (isHindi) "नया वर्शन उपलब्ध: v${meta.versionName}" else "New version available: v${meta.versionName}",
                                style = MaterialTheme.typography.titleSmall.copy(color = EmeraldAccent, fontWeight = FontWeight.Bold)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            if (isDownloadingUpdate) {
                                LinearProgressIndicator(
                                    progress = { downloadProgress },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(6.dp)
                                        .clip(RoundedCornerShape(3.dp)),
                                    color = CyanAccent,
                                    trackColor = CardBorder
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = updateStatusMsg ?: "Downloading...",
                                    style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, fontSize = 10.sp)
                                )
                            } else {
                                Button(
                                    onClick = {
                                        if (activity != null) {
                                            updateManager.downloadAndInstallUpdate(meta, activity)
                                        }
                                    },
                                    modifier = Modifier.fillMaxWidth().height(46.dp),
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark)
                                ) {
                                    Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = if (isHindi) "अपडेट इंस्टॉल करें (${meta.fileSizeHuman})" else "INSTALL UPDATE (${meta.fileSizeHuman})",
                                        style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                    )
                                }
                            }
                        }
                    } else {
                        OutlinedButton(
                            onClick = { updateManager.checkForUpdates(manual = true) },
                            modifier = Modifier.fillMaxWidth().height(46.dp),
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary)
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp), tint = TextSecondary)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "अपडेट की जांच करें" else "CHECK FOR UPDATES",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            }
        }
    }

    // Privacy Dialog
    if (showPrivacyDialog) {
        AlertDialog(
            onDismissRequest = { showPrivacyDialog = false },
            title = {
                Text(
                    text = if (isHindi) "प्राइवेसी और डेटा सुरक्षा" else "Privacy & Data Protection",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "सुपर टेलीकॉम 100% ऑन-डिवाइस प्राइवेसी मानकों का पालन करता है:\n\n• शून्य क्लाउड अपलोड: फाइल ट्रांसफर केवल स्थानीय फोन-से-फोन हॉटस्पॉट या वाई-फाई डायरेक्ट पर होता है।\n• लोकल रिकवरी: स्टोरेज स्कैन केवल आपके फोन के इंटरनल मीडियास्टोर और चयनित फ़ोल्डरों में काम करता है।\n• डेटा निष्कासन: कोई व्यक्तिगत डेटा या ट्रांसफर इतिहास हमारे किसी सर्वर पर एकत्र नहीं होता।\n• अनुमतियां: आप जब चाहें सिस्टम सेटिंग्स से किसी भी अनुमति को रद्द कर सकते हैं।"
                    else
                        "Super Telecom operates under strict on-device data minimization:\n\n• Zero Remote Telemetry: No analytics SDKs or remote trackers.\n• Direct P2P Sockets: File sharing runs strictly over local Wi-Fi Direct or hotspot.\n• Local Scoped Storage: Media discovery scans only local storage.\n• Permission Control: You can revoke any permission at any time via Android Settings.",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                TextButton(onClick = { showPrivacyDialog = false }) {
                    Text(text = if (isHindi) "समझ गया" else "Understood", color = CyanAccent)
                }
            },
            containerColor = CardDark
        )
    }

    // Grievance Officer Dialog
    if (showGrievanceDialog) {
        AlertDialog(
            onDismissRequest = { showGrievanceDialog = false },
            title = {
                Text(
                    text = if (isHindi) "डेटा शिकायत अधिकारी" else "Data Grievance Officer",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Column {
                    Text(
                        text = if (isHindi)
                            "यदि आपके पास डेटा प्राइवेसी या अनुमतियों से संबंधित कोई प्रश्न या चिंता है, तो सीधे हमारे शिकायत अधिकारी से संपर्क करें:"
                        else
                            "For any privacy queries, consent withdrawal, or data concerns, contact our designated Grievance Officer:",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Officer: Customer Care & Privacy Desk\nEmail: supertelecom1002@gmail.com\nPhone: +91 80029 03643\nAddress: Super Telecom, Barganda Road, Giridih, Jharkhand 815301\nResponse Time: Within 24-48 business hours",
                        style = MaterialTheme.typography.bodySmall.copy(color = CyanAccent)
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = { showGrievanceDialog = false }) {
                    Text(text = if (isHindi) "बंद करें" else "Close", color = CyanAccent)
                }
            },
            containerColor = CardDark
        )
    }
}

@Composable
private fun SectionHeader(title: String, icon: ImageVector) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(imageVector = icon, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(18.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.Bold,
                color = TextPrimary,
                fontSize = 15.sp
            )
        )
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary, fontSize = 13.sp))
        Text(text = value, style = MaterialTheme.typography.bodyMedium.copy(color = TextPrimary, fontWeight = FontWeight.SemiBold, fontSize = 13.sp))
    }
}
