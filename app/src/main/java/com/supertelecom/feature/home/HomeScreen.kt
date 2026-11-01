package com.supertelecom.feature.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.model.NavTab
import com.supertelecom.model.RecentTaskItem
import com.supertelecom.model.TaskType
import com.supertelecom.theme.*

@Composable
fun HomeScreen(
    isHindi: Boolean,
    onToggleLanguage: () -> Unit,
    onNavigateTab: (NavTab) -> Unit
) {
    var showDpdpDialog by remember { mutableStateOf(false) }
    var showContactDialog by remember { mutableStateOf(false) }

    val recentTasks = remember {
        listOf(
            RecentTaskItem(
                id = "1",
                title = "Family_Tour_Khandoli.mp4",
                subtitle = if (isHindi) "सुपर ट्रांसफर (सफलतापूर्वक भेजा गया)" else "Super Transfer (Sent to Nearby Device)",
                sizeBytes = 1_850_000_000L,
                timeAgo = if (isHindi) "10 मिनट पहले" else "10 mins ago",
                type = TaskType.TRANSFER_SENT,
                statusText = if (isHindi) "100% पूरा (SHA-256 Verified)" else "100% Complete (SHA-256)"
            ),
            RecentTaskItem(
                id = "2",
                title = "Aadhaar_Document_Scan.pdf",
                subtitle = if (isHindi) "सुपर रिकवर (आंतरिक ट्रैश से बरामद)" else "Super Recover (Restored from Trash)",
                sizeBytes = 2_400_000L,
                timeAgo = if (isHindi) "45 मिनट पहले" else "45 mins ago",
                type = TaskType.RECOVERED_MEDIA,
                statusText = if (isHindi) "सफलतापूर्वक सुरक्षित सेव" else "Restored Successfully"
            ),
            RecentTaskItem(
                id = "3",
                title = "Office_Meeting_Notes.m4a",
                subtitle = if (isHindi) "सुपर ट्रांसफर (प्राप्त किया गया)" else "Super Transfer (Received from Pixel)",
                sizeBytes = 14_800_000L,
                timeAgo = if (isHindi) "2 घंटे पहले" else "2 hours ago",
                type = TaskType.TRANSFER_RECEIVED,
                statusText = if (isHindi) "100% पूरा" else "100% Complete"
            )
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .statusBarsPadding(),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 120.dp)
    ) {
        item {
            // ── TOP BAR ──
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.linearGradient(listOf(CyanAccent, Color(0xFF2563EB)))
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "ST",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Black,
                                color = BgDark
                            )
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Text(
                            text = "Super Telecom App",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.Black,
                                color = TextPrimary,
                                fontSize = 18.sp
                            )
                        )
                        Text(
                            text = if (isHindi) "ट्रांसफर • रिकवरी • लॉन्चर सुइट" else "Transfer • Recover • Launcher",
                            style = MaterialTheme.typography.labelSmall.copy(color = CyanAccent)
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Language Switcher
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

                    Spacer(modifier = Modifier.width(8.dp))

                    // Settings / Info Button
                    IconButton(
                        onClick = { showContactDialog = true },
                        modifier = Modifier
                            .size(38.dp)
                            .background(CardDark, CircleShape)
                            .border(1.dp, CardBorder, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = "Settings",
                            tint = TextSecondary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // DPDP Act 2027 Trust Strip
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(EmeraldAccent.copy(alpha = 0.08f))
                    .border(1.dp, EmeraldAccent.copy(alpha = 0.25f), RoundedCornerShape(14.dp))
                    .clickable { showDpdpDialog = true }
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = null,
                        tint = EmeraldAccent,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "100% ऑन-डिवाइस प्राइवेसी • DPDP ACT 2027" else "DPDP ACT 2027 CERTIFIED • ZERO CLOUD UPLOADS",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = EmeraldAccent
                            )
                        )
                        Text(
                            text = if (isHindi) "कोई भी फाइल सर्वर पर नहीं जाती। 0 ट्रैकिंग, 0 विज्ञापन।" else "All transfers & scans run locally on phone. Zero remote calls.",
                            style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp)
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = null,
                        tint = EmeraldAccent,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ── 3 LARGE ACTION CARDS ──
            Text(
                text = if (isHindi) "मुख्य एक्शन मॉड्यूल्स" else "Core Capability Engines",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Action Card 1: Super Transfer (Blue/Cyan Gradient)
            BigActionCard(
                title = if (isHindi) "सुपर ट्रांसफर (Super Transfer)" else "Super Transfer",
                subtitle = if (isHindi)
                    "बिना इंटरनेट एक फोन से दूसरे फोन में फोटो, वीडियो, रिकॉर्डिंग और फाइलें भेजें"
                else
                    "Send 4GB+ videos, photos, and files between phones offline at up to 60 MB/s",
                ctaText = if (isHindi) "अभी फाइल भेजें या प्राप्त करें →" else "Start File Transfer →",
                gradient = Brush.linearGradient(listOf(Color(0xFF0369A1), Color(0xFF0891B2))),
                icon = Icons.Default.Send,
                onClick = { onNavigateTab(NavTab.TRANSFER) }
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Action Card 2: Super Recover (Green/Emerald Gradient)
            BigActionCard(
                title = if (isHindi) "सुपर रिकवर (Super Recover)" else "Super Recover",
                subtitle = if (isHindi)
                    "डिलीट हुई फोटो, वीडियो, ऑडियो रिकॉर्डिंग और डॉक्यूमेंट्स को स्कैन व रिकवर करें"
                else
                    "Deep-scan deleted photos, videos, recordings & documents with honest 4-tier discovery",
                ctaText = if (isHindi) "डेटा रिकवर शुरू करें →" else "Start Media Recovery →",
                gradient = Brush.linearGradient(listOf(Color(0xFF065F46), Color(0xFF059669))),
                icon = Icons.Default.Restore,
                onClick = { onNavigateTab(NavTab.RECOVER) }
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Action Card 3: Super Launcher (Purple/Indigo Gradient)
            BigActionCard(
                title = if (isHindi) "सुपर लॉन्चर (Super Launcher)" else "Super Launcher",
                subtitle = if (isHindi)
                    "4 प्रीमियम थीम्स के साथ अपने फोन की होम-स्क्रीन को कस्टमाइज़ करें"
                else
                    "Customize home screen with 4 clean themes (Minimal, iOS, Pixel, Classic) & 1-tap restore",
                ctaText = if (isHindi) "लॉन्चर थीम बदलें →" else "Explore Launcher Themes →",
                gradient = Brush.linearGradient(listOf(Color(0xFF4C1D95), Color(0xFF6D28D9))),
                icon = Icons.Default.Smartphone,
                onClick = { onNavigateTab(NavTab.LAUNCHER) }
            )

            Spacer(modifier = Modifier.height(24.dp))

            // ── RECENT COMPLETED TASKS ──
            Text(
                text = if (isHindi) "हाल के पूरे किए गए काम (Recent Completed Tasks)" else "Recent Completed Tasks",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )

            Spacer(modifier = Modifier.height(8.dp))
        }

        items(recentTasks) { task ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                when (task.type) {
                                    TaskType.TRANSFER_SENT -> CyanAccent.copy(alpha = 0.15f)
                                    TaskType.TRANSFER_RECEIVED -> EmeraldAccent.copy(alpha = 0.15f)
                                    TaskType.RECOVERED_MEDIA -> AmberAccent.copy(alpha = 0.15f)
                                }
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = when (task.type) {
                                TaskType.TRANSFER_SENT -> Icons.Default.ArrowUpward
                                TaskType.TRANSFER_RECEIVED -> Icons.Default.ArrowDownward
                                TaskType.RECOVERED_MEDIA -> Icons.Default.CheckCircle
                            },
                            contentDescription = null,
                            tint = when (task.type) {
                                TaskType.TRANSFER_SENT -> CyanAccent
                                TaskType.TRANSFER_RECEIVED -> EmeraldAccent
                                TaskType.RECOVERED_MEDIA -> AmberAccent
                            },
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = task.title,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            ),
                            maxLines = 1
                        )
                        Text(
                            text = "${task.subtitle} • ${(task.sizeBytes / 1_000_000.0).format(1)} MB",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = task.statusText,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = EmeraldAccent,
                                fontSize = 10.sp
                            )
                        )
                        Text(
                            text = task.timeAgo,
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = TextMuted,
                                fontSize = 10.sp
                            )
                        )
                    }
                }
            }
        }
    }

    // DPDP Dialog
    if (showDpdpDialog) {
        AlertDialog(
            onDismissRequest = { showDpdpDialog = false },
            title = {
                Text(
                    text = if (isHindi) "DPDP Act 2027 प्राइवेसी गारंटी" else "DPDP Act 2027 On-Device Guarantee",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "सुपर टेलीकॉम ऐप 100% ऑन-डिवाइस काम करता है:\n\n• कोई भी फाइल किसी बाहरी क्लाउड सर्वर पर नहीं भेजी जाती।\n• ट्रांसफर केवल लोकल वाई-फाई/हॉटस्पॉट पर सीधे फोन-टू-फोन होता है।\n• रिकवरी स्कैन पूरी तरह आपके फोन की इंटरनल मेमोरी पर चलता है।\n• शून्य ट्रैकिंग, शून्य विज्ञापन, शून्य सब्सक्रिप्शन।"
                    else
                        "Super Telecom operates under strict on-device data minimization:\n\n• Zero Remote Telemetry: No analytics, tracking or surveillance SDKs.\n• Local Socket P2P: File sharing runs strictly over local Wi-Fi / hotspot.\n• Honest Recovery: Scans only local MediaStore and SAF folders.\n• Zero Subscriptions: 100% free forever.",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                TextButton(onClick = { showDpdpDialog = false }) {
                    Text(text = if (isHindi) "समझ गया" else "Understood", color = CyanAccent)
                }
            },
            containerColor = CardDark
        )
    }

    // Store & Settings Dialog
    if (showContactDialog) {
        AlertDialog(
            onDismissRequest = { showContactDialog = false },
            title = {
                Text(
                    text = if (isHindi) "सुपर टेलीकॉम (गिरिडीह)" else "Super Telecom Giridih",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "स्थान: बरगंडा रोड (शिवम क्लिनिक के पास), गिरिडीह, झारखंड 815301\nकॉल / वॉट्सऐप: +91 80029 03643\nसमय: सुबह 10:00 से रात 9:30 बजे (सातों दिन)\n\nविशेषज्ञता: 45x माइक्रोस्कोप मदरबोर्ड BGA सोल्डरिंग, कर्व्ड AMOLED ग्लास रिप्लेसमेंट, CPU रीबॉलिंग और वाटर डैमेज रिवाइवल।"
                    else
                        "Address: Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301\nCall/WhatsApp: +91 80029 03643\nHours: 10:00 AM – 9:30 PM (7 Days a week)\n\nSpecialist in 45x Trinocular Motherboard Soldering, Curved AMOLED Glass Separation, and Water Damage Revival.",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                TextButton(onClick = { showContactDialog = false }) {
                    Text(text = if (isHindi) "बंद करें" else "Close", color = CyanAccent)
                }
            },
            containerColor = CardDark
        )
    }
}

@Composable
private fun BigActionCard(
    title: String,
    subtitle: String,
    ctaText: String,
    gradient: Brush,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(gradient)
            .clickable(onClick = onClick)
            .padding(16.dp)
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .background(Color.Black.copy(alpha = 0.25f), RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            fontSize = 17.sp
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = Color.White.copy(alpha = 0.9f),
                    fontSize = 12.sp,
                    lineHeight = 17.sp
                )
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Big Action Button inside Card
            Button(
                onClick = onClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.Black.copy(alpha = 0.35f),
                    contentColor = Color.White
                )
            ) {
                Text(
                    text = ctaText,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                )
            }
        }
    }
}

private fun Double.format(digits: Int) = "%.${digits}f".format(this)
