package com.supertelecom.feature.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.model.NavTab
import com.supertelecom.theme.*

@Composable
fun HomeScreen(
    isHindi: Boolean,
    onToggleLanguage: () -> Unit,
    onNavigateTab: (NavTab) -> Unit
) {
    var showDpdpDialog by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .statusBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        // Top App Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "SUPER",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = CyanAccent,
                            letterSpacing = 1.sp
                        )
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "TELECOM",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = TextPrimary,
                            letterSpacing = 1.sp
                        )
                    )
                }
                Text(
                    text = if (isHindi) "गिरिडीह का #1 मोबाइल रिपेयर व यूटिलिटी हब" else "Giridih #1 Repair & Utility Hub",
                    style = MaterialTheme.typography.labelSmall
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                // Language Toggle Pill
                Button(
                    onClick = onToggleLanguage,
                    colors = ButtonDefaults.buttonColors(containerColor = CardDark),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Translate,
                        contentDescription = "Language",
                        tint = CyanAccent,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isHindi) "ENG" else "हिंदी",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = TextPrimary)
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Info / DPDP Button
                IconButton(
                    onClick = { showDpdpDialog = true },
                    modifier = Modifier
                        .size(36.dp)
                        .background(CardDark, CircleShape)
                        .border(1.dp, CardBorder, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "DPDP Privacy",
                        tint = EmeraldAccent,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // DPDP Trust Badge
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(EmeraldAccent.copy(alpha = 0.08f))
                .border(1.dp, EmeraldAccent.copy(alpha = 0.25f), RoundedCornerShape(16.dp))
                .clickable { showDpdpDialog = true }
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.VerifiedUser,
                    contentDescription = null,
                    tint = EmeraldAccent,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = if (isHindi) "DPDP ACT 2027 पूर्ण सुरक्षित • शून्य क्लाउड अपलोड" else "DPDP ACT 2027 COMPLIANT • 100% ON-DEVICE",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = EmeraldAccent
                        )
                    )
                    Text(
                        text = if (isHindi) "आपका कोई भी डेटा किसी सर्वर पर नहीं भेजा जाता है।" else "Zero telemetry. Your files never leave your smartphone.",
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

        Spacer(modifier = Modifier.height(20.dp))

        // Quick Launch Hub
        Text(
            text = if (isHindi) "प्रमुख यूटिलिटी मॉड्यूल" else "Super Capability Suite",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
        )
        Text(
            text = if (isHindi) "बिना इंटरनेट ऑफलाइन शेयरिंग, मीडिया रिकवरी और क्लीन लॉन्चर" else "Offline file transfer, deep media discovery, and safe home launcher",
            style = MaterialTheme.typography.bodyMedium
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Module Card 1: Super Transfer
        CapabilityCard(
            title = if (isHindi) "Super Transfer (फ़ाइल शेयरिंग)" else "Super Transfer",
            subtitle = if (isHindi) "Wi-Fi Direct और लोकल हॉटस्पॉट से बड़ी 4GB+ फाइल्स 60MB/s तक भेजें" else "High-speed Wi-Fi Direct chunked streaming (up to 60 MB/s)",
            badge = if (isHindi) "शून्य इंटरनेट" else "Zero Internet",
            badgeColor = CyanAccent,
            icon = Icons.Default.SwapHoriz,
            onClick = { onNavigateTab(NavTab.TRANSFER) }
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Module Card 2: Super Recover
        CapabilityCard(
            title = if (isHindi) "Super Recover (मीडिया रिकवरी)" else "Super Recover",
            subtitle = if (isHindi) "हटाए गए फोटो, वीडियो व ऑडियो की ईमानदार 4-स्तरीय ऑन-डिवाइस स्कैनिंग" else "Honest 4-tier on-device discovery for lost photos, videos & docs",
            badge = if (isHindi) "शून्य रूट रिस्क" else "Zero Root Required",
            badgeColor = EmeraldAccent,
            icon = Icons.Default.Restore,
            onClick = { onNavigateTab(NavTab.RECOVER) }
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Module Card 3: Super Launcher
        CapabilityCard(
            title = if (isHindi) "Super Launcher (कस्टम होम स्क्रीन)" else "Super Launcher",
            subtitle = if (isHindi) "4 आकर्षक थीम्स (Minimal, iOS, Pixel, Classic) और 1-क्लिक ओरिजिनल रीस्टोर" else "4 instant clean themes with safe 1-tap original launcher restore",
            badge = if (isHindi) "सुरक्षित स्विच" else "Safe Role Switch",
            badgeColor = AmberAccent,
            icon = Icons.Default.Apps,
            onClick = { onNavigateTab(NavTab.LAUNCHER) }
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Recent Task Log & Diagnostics
        Text(
            text = if (isHindi) "डिवाइस डायग्नोस्टिक व स्टेटस" else "Device Status & Integrity",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
        )

        Spacer(modifier = Modifier.height(8.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(CardDark)
                .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                .padding(14.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                StatusRow(
                    label = if (isHindi) "ऐप आर्किटेक्चर" else "App Architecture",
                    value = "4-Engine Native Compose v2.4.0",
                    statusColor = CyanAccent
                )
                StatusRow(
                    label = if (isHindi) "प्राइवेसी शील्ड" else "Privacy Shield",
                    value = if (isHindi) "सक्रिय (DPDP 2027 अनुपालन)" else "Active (DPDP 2027 On-Device)",
                    statusColor = EmeraldAccent
                )
                StatusRow(
                    label = if (isHindi) "नेटवर्क टेलीमेट्री" else "Network Telemetry",
                    value = if (isHindi) "शून्य बाहरी कनेक्शन (0 KB/s)" else "Zero Remote Calls (0 KB/s)",
                    statusColor = EmeraldAccent
                )
                StatusRow(
                    label = if (isHindi) "लैब वर्कशॉप" else "Lab Workshop",
                    value = "Station Road, Giridih (Est. 2016)",
                    statusColor = TextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // About Button
        OutlinedButton(
            onClick = { showAboutDialog = true },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextSecondary),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(imageVector = Icons.Default.Info, contentDescription = null, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = if (isHindi) "सुपर टेलीकॉम गिरिडीह के बारे में" else "About Super Telecom Giridih",
                style = MaterialTheme.typography.labelSmall
            )
        }

        Spacer(modifier = Modifier.height(24.dp))
    }

    // DPDP Act 2027 Dialog
    if (showDpdpDialog) {
        AlertDialog(
            onDismissRequest = { showDpdpDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Security, contentDescription = null, tint = EmeraldAccent)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isHindi) "DPDP Act 2027 प्राइवेसी गारंटी" else "DPDP Act 2027 Guarantee",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = if (isHindi)
                            "सुपर टेलीकॉम ऐप पूरी तरह से ऑन-डिवाइस कार्य करता है:\n\n• शून्य रिमोट टेलीमेट्री: आपका कोई भी पर्सनल डेटा, फोन नंबर या मीडिया किसी बाहरी सर्वर पर नहीं जाता।\n• लोकल P2P ट्रांसफर: फाइल्स केवल आपके लोकल वाई-फाई या हॉटस्पॉट पर बिना इंटरनेट भेजी जाती हैं।\n• ईमानदार रिकवरी: केवल अधिकृत मीडियास्टोर और स्टोरेज एक्सेस फ्रेमवर्क के माध्यम से स्कैनिंग की जाती है।"
                        else
                            "Super Telecom operates strictly under on-device data minimization principles:\n\n• Zero Remote Telemetry: No analytics, tracking or surveillance SDKs are included.\n• Local P2P Transfer: Data flows exclusively over your direct Wi-Fi/hotspot link.\n• Honest Recovery: Scans only authorized MediaStore and Storage Access Framework folders.\n• Zero Subscriptions: 100% Free with no paywalls.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = { showDpdpDialog = false }) {
                    Text(text = if (isHindi) "समझ गया" else "Understood", color = CyanAccent)
                }
            },
            containerColor = CardDark,
            tonalElevation = 6.dp
        )
    }

    // About Store Dialog
    if (showAboutDialog) {
        AlertDialog(
            onDismissRequest = { showAboutDialog = false },
            title = {
                Text(
                    text = if (isHindi) "सुपर टेलीकॉम — गिरिडीह" else "Super Telecom Giridih",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "स्थान: स्टेशन रोड, गिरिडीह, झारखंड 815301\nस्थापना: 2016 (10+ वर्ष का अनुभव)\nरेटिंग: 4.9 / 5 ★ (1,200+ सत्यापित समीक्षाएं)\n\nविशेषज्ञता: 45x माइक्रोस्कोप मदरबोर्ड BGA सोल्डरिंग, कर्व्ड AMOLED ग्लास रिप्लेसमेंट, CPU रीबॉलिंग और इमरजेंसी वाटर डैमेज रिवाइवल।"
                    else
                        "Address: Station Road, Giridih, Jharkhand 815301\nEstablished: 2016 (10+ Years Experience)\nRating: 4.9 / 5 ★ (1,200+ Verified Reviews)\n\nSpecialization: 45x Trinocular BGA Micro-soldering, Curved AMOLED Glass Separation, CPU Reballing, and Emergency Water Damage Revival.",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                TextButton(onClick = { showAboutDialog = false }) {
                    Text(text = if (isHindi) "बंद करें" else "Close", color = CyanAccent)
                }
            },
            containerColor = CardDark
        )
    }
}

@Composable
private fun CapabilityCard(
    title: String,
    subtitle: String,
    badge: String,
    badgeColor: Color,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(badgeColor.copy(alpha = 0.15f))
                    .border(1.dp, badgeColor.copy(alpha = 0.3f), RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = badgeColor, modifier = Modifier.size(24.dp))
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(badgeColor.copy(alpha = 0.15f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = badge,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = badgeColor
                            )
                        )
                    }
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodyMedium.copy(fontSize = 12.sp)
                )
            }

            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = null,
                tint = TextMuted,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

@Composable
private fun StatusRow(label: String, value: String, statusColor: Color) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium.copy(fontSize = 12.sp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium.copy(
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = statusColor
            )
        )
    }
}
