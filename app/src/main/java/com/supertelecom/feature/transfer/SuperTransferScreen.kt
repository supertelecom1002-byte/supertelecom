package com.supertelecom.feature.transfer

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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.model.TransferDirection
import com.supertelecom.model.TransferFileItem
import com.supertelecom.model.TransferStatus
import com.supertelecom.theme.*

@Composable
fun SuperTransferScreen(isHindi: Boolean) {
    var mode by remember { mutableStateOf(TransferDirection.SEND) }
    var pairingCode by remember { mutableStateOf("582 914") }
    var deviceName by remember { mutableStateOf("Pixel 8 Pro (Nearby)") }
    var isTransferring by remember { mutableStateOf(false) }
    var isPaused by remember { mutableStateOf(false) }
    var transferProgress by remember { mutableFloatStateOf(0.45f) }
    var transferSpeed by remember { mutableStateOf("52.4 MB/s") }
    var showQrDialog by remember { mutableStateOf(false) }
    var showConsentDialog by remember { mutableStateOf(false) }

    // Selected Files Queue
    val selectedFiles = remember {
        mutableStateListOf(
            TransferFileItem(
                id = "1",
                name = "Khandoli_4K_Video_Recording.mp4",
                sizeBytes = 2_450_000_000L,
                mimeType = "video/mp4",
                sha256 = "3ebc895e5bb1d5080268bb61fa3454e9c3dfdabf9313307cb4a7aeab81287afc",
                progress = 0.65f,
                status = TransferStatus.TRANSFERRING
            ),
            TransferFileItem(
                id = "2",
                name = "Motherboard_Circuit_Schematic.pdf",
                sizeBytes = 14_800_000L,
                mimeType = "application/pdf",
                sha256 = "ca978112ca1bbdcafac231b39a23dc4da7860814961b17b2e88a09b30c149d94",
                progress = 1.0f,
                status = TransferStatus.COMPLETED
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
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = if (isHindi) "सुपर ट्रांसफर (Super Transfer)" else "Super Transfer",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = CyanAccent,
                            fontSize = 20.sp
                        )
                    )
                    Text(
                        text = if (isHindi) "शून्य इंटरनेट • 64KB बफ़र्ड स्ट्रीमिंग • ओरिजिनल क्वालिटी" else "Zero Internet • 64KB Buffered Socket • Up to 60 MB/s",
                        style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary)
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(CyanAccent.copy(alpha = 0.15f))
                        .border(1.dp, CyanAccent.copy(alpha = 0.35f), RoundedCornerShape(10.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "Wi-Fi Direct P2P",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = CyanAccent,
                            fontSize = 10.sp
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ── 1. MODE SELECTION: 3 BIG TOP BUTTONS ──
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Send Files Button
                ModeButton(
                    title = if (isHindi) "फाइल भेजें" else "SEND FILES",
                    icon = Icons.Default.ArrowUpward,
                    isSelected = mode == TransferDirection.SEND,
                    selectedColor = CyanAccent,
                    modifier = Modifier.weight(1f),
                    onClick = { mode = TransferDirection.SEND }
                )

                // Receive Files Button
                ModeButton(
                    title = if (isHindi) "फाइल प्राप्त करें" else "RECEIVE FILES",
                    icon = Icons.Default.ArrowDownward,
                    isSelected = mode == TransferDirection.RECEIVE,
                    selectedColor = EmeraldAccent,
                    modifier = Modifier.weight(1f),
                    onClick = { mode = TransferDirection.RECEIVE }
                )

                // Scan / Pair Button
                ModeButton(
                    title = if (isHindi) "QR / कोड" else "SCAN / PAIR",
                    icon = Icons.Default.QrCode,
                    isSelected = mode == TransferDirection.SCAN_CONNECT,
                    selectedColor = AmberAccent,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        mode = TransferDirection.SCAN_CONNECT
                        showQrDialog = true
                    }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── 2. WHAT TO SEND? (4 LARGE FILE SELECTION BUTTONS) ──
            Text(
                text = if (isHindi) "क्या भेजना है? (फाइल प्रकार चुनें)" else "Select Files to Send",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = if (isHindi) "मल्टी-सेलेक्शन सपोर्ट: एक साथ कई तस्वीरें या बड़े वीडियो चुनें" else "Multi-select: pick photos, full 4K videos, voice notes or documents",
                style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp, color = TextMuted)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                CategoryPickerCard(
                    title = if (isHindi) "फोटो चुनें" else "Photos",
                    sub = "JPG, PNG, HEIC",
                    icon = Icons.Default.Photo,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        selectedFiles.add(
                            TransferFileItem(
                                id = System.currentTimeMillis().toString(),
                                name = "Selected_Photo_${selectedFiles.size + 1}.jpg",
                                sizeBytes = 4_500_000L,
                                mimeType = "image/jpeg",
                                status = TransferStatus.PENDING
                            )
                        )
                    }
                )

                CategoryPickerCard(
                    title = if (isHindi) "वीडियो चुनें" else "Videos",
                    sub = "MP4, MKV (4GB+)",
                    icon = Icons.Default.Videocam,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        selectedFiles.add(
                            TransferFileItem(
                                id = System.currentTimeMillis().toString(),
                                name = "Selected_Video_4K_${selectedFiles.size + 1}.mp4",
                                sizeBytes = 1_200_000_000L,
                                mimeType = "video/mp4",
                                status = TransferStatus.PENDING
                            )
                        )
                    }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                CategoryPickerCard(
                    title = if (isHindi) "ऑडियो/रिकॉर्डिंग" else "Audio/Notes",
                    sub = "M4A, MP3, WAV",
                    icon = Icons.Default.Mic,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        selectedFiles.add(
                            TransferFileItem(
                                id = System.currentTimeMillis().toString(),
                                name = "Call_Recording_${selectedFiles.size + 1}.m4a",
                                sizeBytes = 8_200_000L,
                                mimeType = "audio/mp4",
                                status = TransferStatus.PENDING
                            )
                        )
                    }
                )

                CategoryPickerCard(
                    title = if (isHindi) "डॉक्यूमेंट व अन्य" else "Docs & Other",
                    sub = "PDF, DOCX, ZIP",
                    icon = Icons.Default.Description,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        selectedFiles.add(
                            TransferFileItem(
                                id = System.currentTimeMillis().toString(),
                                name = "Office_Document_${selectedFiles.size + 1}.pdf",
                                sizeBytes = 3_100_000L,
                                mimeType = "application/pdf",
                                status = TransferStatus.PENDING
                            )
                        )
                    }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── 3. PAIRING & NEARBY DEVICE PANEL ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(14.dp)
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
                                    .size(36.dp)
                                    .background(CyanAccent.copy(alpha = 0.15f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Wifi, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(18.dp))
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = deviceName,
                                    style = MaterialTheme.typography.titleMedium.copy(fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = if (isHindi) "लोकल P2P चैनल कनेक्टेड" else "Local P2P Direct Channel",
                                    style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent)
                                )
                            }
                        }

                        // PIN code
                        Column(horizontalAlignment = Alignment.End) {
                            Text(text = "PIN", style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, fontSize = 9.sp))
                            Text(
                                text = pairingCode,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    color = CyanGlow
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Divider(color = CardBorder)
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (isHindi) "ट्रांसफर स्पीड: $transferSpeed" else "Transfer Speed: $transferSpeed",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = TextPrimary)
                        )
                        OutlinedButton(
                            onClick = { showConsentDialog = true },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = AmberAccent)
                        ) {
                            Text(
                                text = if (isHindi) "सहमति जांच (Consent)" else "Receiver Consent",
                                style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── 4. SELECTED FILES QUEUE & START TRANSFER BUTTON ──
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isHindi) "चुनी गई फाइलें (${selectedFiles.size})" else "Selected Files (${selectedFiles.size})",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                if (selectedFiles.isNotEmpty()) {
                    TextButton(onClick = { selectedFiles.clear() }) {
                        Text(text = if (isHindi) "सभी हटाएं" else "Clear All", color = RoseAccent, style = MaterialTheme.typography.labelSmall)
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
        }

        // File Queue Items
        items(selectedFiles) { file ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Icon(
                                imageVector = when {
                                    file.status == TransferStatus.COMPLETED -> Icons.Default.CheckCircle
                                    file.mimeType.startsWith("video") -> Icons.Default.Videocam
                                    file.mimeType.startsWith("image") -> Icons.Default.Photo
                                    file.mimeType.startsWith("audio") -> Icons.Default.Mic
                                    else -> Icons.Default.InsertDriveFile
                                },
                                contentDescription = null,
                                tint = if (file.status == TransferStatus.COMPLETED) EmeraldAccent else CyanAccent,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = file.name,
                                    style = MaterialTheme.typography.titleMedium.copy(fontSize = 12.sp, fontWeight = FontWeight.SemiBold),
                                    maxLines = 1
                                )
                                Text(
                                    text = "${(file.sizeBytes / 1_000_000.0).format(1)} MB • ${
                                        if (file.status == TransferStatus.COMPLETED)
                                            (if (isHindi) "पूर्ण (SHA-256 सत्यापित)" else "Completed (SHA-256 Verified)")
                                        else if (file.status == TransferStatus.TRANSFERRING)
                                            "${(file.progress * 100).toInt()}% • 52 MB/s"
                                        else
                                            (if (isHindi) "तैयार" else "Pending")
                                    }",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = if (file.status == TransferStatus.COMPLETED) EmeraldAccent else TextMuted,
                                        fontSize = 10.sp
                                    )
                                )
                            }
                        }

                        IconButton(
                            onClick = { selectedFiles.remove(file) },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(Icons.Default.Close, contentDescription = "Remove", tint = TextMuted, modifier = Modifier.size(16.dp))
                        }
                    }

                    if (file.status == TransferStatus.TRANSFERRING) {
                        Spacer(modifier = Modifier.height(6.dp))
                        LinearProgressIndicator(
                            progress = { file.progress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(4.dp)
                                .clip(RoundedCornerShape(2.dp)),
                            color = CyanAccent,
                            trackColor = CardBorder
                        )
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(14.dp))

            // BIG START / CONTROL BUTTONS
            if (isTransferring) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = { isPaused = !isPaused },
                        modifier = Modifier
                            .weight(1f)
                            .height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = AmberAccent, contentColor = BgDark)
                    ) {
                        Icon(if (isPaused) Icons.Default.PlayArrow else Icons.Default.Pause, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(if (isPaused) (if (isHindi) "शुरू करें (Resume)" else "Resume") else (if (isHindi) "रोकें (Pause)" else "Pause"))
                    }

                    Button(
                        onClick = { isTransferring = false },
                        modifier = Modifier
                            .weight(1f)
                            .height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = RoseAccent, contentColor = Color.White)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(if (isHindi) "रद्द करें (Cancel)" else "Cancel")
                    }
                }
            } else {
                Button(
                    onClick = {
                        isTransferring = true
                        // Mark first file transferring
                        if (selectedFiles.isNotEmpty()) {
                            selectedFiles[0] = selectedFiles[0].copy(status = TransferStatus.TRANSFERRING, progress = 0.45f)
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark)
                ) {
                    Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isHindi)
                            "🚀 ओरिजिनल क्वालिटी में ट्रांसफर शुरू करें (Start Transfer)"
                        else
                            "Start High-Speed P2P Transfer (60 MB/s)",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // SHA-256 Security Notice
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.ShieldCheck, contentDescription = null, tint = EmeraldAccent, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isHindi)
                            "✅ SHA-256 बाइट वेरिफिकेशन: हर फाइल बिना कंप्रेस किए 100% असली क्वालिटी में ट्रांसफर होती है।"
                        else
                            "SHA-256 Integrity Verified: Zero compression, byte-perfect original fidelity guaranteed.",
                        style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp, color = TextSecondary)
                    )
                }
            }
        }
    }

    // QR Pair Dialog
    if (showQrDialog) {
        AlertDialog(
            onDismissRequest = { showQrDialog = false },
            title = {
                Text(
                    text = if (isHindi) "QR कोड से तुरंत जोड़ें" else "Scan QR to Pair Instantly",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Box(
                        modifier = Modifier
                            .size(170.dp)
                            .background(Color.White, RoundedCornerShape(14.dp))
                            .padding(12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.QrCode2,
                            contentDescription = "QR Code",
                            tint = Color.Black,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "PIN: $pairingCode",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = CyanAccent
                        )
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = { showQrDialog = false }) {
                    Text(text = if (isHindi) "बंद करें" else "Close", color = CyanAccent)
                }
            },
            containerColor = CardDark
        )
    }

    // Consent Dialog
    if (showConsentDialog) {
        AlertDialog(
            onDismissRequest = { showConsentDialog = false },
            title = {
                Text(
                    text = if (isHindi) "फाइल प्राप्त करने की सहमति" else "Receiver Consent Request",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "डिवाइस 'Pixel 8 Pro (582-914)' आपको 2.45 GB वीडियो फाइल भेजना चाहता है। क्या आप इसे स्वीकार करते हैं?"
                    else
                        "Device 'Pixel 8 Pro' requests to send 2.45 GB video. Do you accept this transfer?",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                Button(
                    onClick = { showConsentDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark)
                ) {
                    Text(text = if (isHindi) "स्वीकार करें (Accept)" else "Accept")
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showConsentDialog = false }) {
                    Text(text = if (isHindi) "अस्वीकार करें" else "Decline")
                }
            },
            containerColor = CardDark
        )
    }
}

@Composable
private fun ModeButton(
    title: String,
    icon: ImageVector,
    isSelected: Boolean,
    selectedColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(52.dp),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isSelected) selectedColor else CardDark,
            contentColor = if (isSelected) BgDark else TextSecondary
        ),
        contentPadding = PaddingValues(horizontal = 6.dp, vertical = 8.dp),
        border = if (isSelected) null else androidx.compose.foundation.BorderStroke(1.dp, CardBorder)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(imageVector = icon, contentDescription = null, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 10.sp
                )
            )
        }
    }
}

@Composable
private fun CategoryPickerCard(
    title: String,
    sub: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .height(56.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 10.dp, vertical = 6.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxSize()) {
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .background(CyanAccent.copy(alpha = 0.12f), RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                Text(text = title, style = MaterialTheme.typography.titleMedium.copy(fontSize = 11.sp, fontWeight = FontWeight.Bold))
                Text(text = sub, style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp, color = TextMuted))
            }
        }
    }
}

private fun Double.format(digits: Int) = "%.${digits}f".format(this)
