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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.model.TransferDirection
import com.supertelecom.model.TransferFileItem
import com.supertelecom.model.TransferStatus
import com.supertelecom.theme.*

@Composable
fun SuperTransferScreen(isHindi: Boolean) {
    var direction by remember { mutableStateOf(TransferDirection.SEND) }
    var pairingCode by remember { mutableStateOf("582 914") }
    var transferSpeed by remember { mutableStateOf("48.5 MB/s") }
    var isConnected by remember { mutableStateOf(false) }
    var showConsentDialog by remember { mutableStateOf(false) }
    var showQrDialog by remember { mutableStateOf(false) }

    // Mock Transfer Queue
    val queue = remember {
        mutableStateListOf(
            TransferFileItem(
                id = "1",
                name = "4K_Camera_Teardown_Giridih.mp4",
                sizeBytes = 2_450_000_000L, // 2.45 GB
                mimeType = "video/mp4",
                sha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                progress = 0.72f,
                status = TransferStatus.TRANSFERRING
            ),
            TransferFileItem(
                id = "2",
                name = "Motherboard_Schematic_BGA.pdf",
                sizeBytes = 14_200_000L,
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
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 12.dp)
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
                        text = if (isHindi) "Super Transfer" else "Super Transfer",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = CyanAccent
                        )
                    )
                    Text(
                        text = if (isHindi) "64KB बफ़र्ड चंक स्ट्रीमिंग • शून्य RAM ओवरलोड" else "64KB Buffered Chunk Streaming • 0 RAM Bloat",
                        style = MaterialTheme.typography.labelSmall
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isConnected) EmeraldAccent.copy(alpha = 0.15f) else AmberAccent.copy(alpha = 0.15f))
                        .border(1.dp, if (isConnected) EmeraldAccent.copy(alpha = 0.4f) else AmberAccent.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = if (isConnected) (if (isHindi) "P2P कनेक्टेड" else "P2P CONNECTED") else (if (isHindi) "रेडी टू पेयर" else "READY TO PAIR"),
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = if (isConnected) EmeraldAccent else AmberAccent,
                            fontSize = 10.sp
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Direction Switcher (SEND vs RECEIVE)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                    .padding(4.dp)
            ) {
                Button(
                    onClick = { direction = TransferDirection.SEND },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (direction == TransferDirection.SEND) CyanAccent else Color.Transparent,
                        contentColor = if (direction == TransferDirection.SEND) BgDark else TextSecondary
                    ),
                    contentPadding = PaddingValues(vertical = 10.dp)
                ) {
                    Icon(imageVector = Icons.Default.ArrowUpward, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isHindi) "फाइलें भेजें (SEND)" else "SEND FILES",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                    )
                }

                Button(
                    onClick = { direction = TransferDirection.RECEIVE },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (direction == TransferDirection.RECEIVE) EmeraldAccent else Color.Transparent,
                        contentColor = if (direction == TransferDirection.RECEIVE) BgDark else TextSecondary
                    ),
                    contentPadding = PaddingValues(vertical = 10.dp)
                ) {
                    Icon(imageVector = Icons.Default.ArrowDownward, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isHindi) "फाइलें प्राप्त करें (RECEIVE)" else "RECEIVE FILES",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Pairing & Connection Bar
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
                        Column {
                            Text(
                                text = if (isHindi) "6-अंकों का सुरक्षित पेयरिंग पिन" else "6-Digit Secure Pairing PIN",
                                style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                            )
                            Text(
                                text = pairingCode,
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Black,
                                    fontFamily = FontFamily.Monospace,
                                    letterSpacing = 3.sp,
                                    color = CyanGlow
                                )
                            )
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(
                                onClick = { showQrDialog = true },
                                shape = RoundedCornerShape(10.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary)
                            ) {
                                Icon(imageVector = Icons.Default.QrCode, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "QR", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                            }

                            Button(
                                onClick = { isConnected = !isConnected },
                                shape = RoundedCornerShape(10.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isConnected) RoseAccent.copy(alpha = 0.2f) else CyanAccent,
                                    contentColor = if (isConnected) RoseAccent else BgDark
                                )
                            ) {
                                Text(
                                    text = if (isConnected) (if (isHindi) "डिस्कनेक्ट" else "Disconnect") else (if (isHindi) "कनेक्ट करें" else "Connect"),
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Divider(color = CardBorder, thickness = 1.dp)
                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Speed, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "स्पीड: $transferSpeed" else "Speed: $transferSpeed",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = TextPrimary)
                            )
                        }

                        Text(
                            text = if (isHindi) "Wi-Fi Direct / हॉटस्पॉट P2P" else "Wi-Fi Direct / Local Socket",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // File Category Selectors
            Text(
                text = if (isHindi) "फाइलें चुनें (मल्टी-सेलेक्शन सपोर्ट)" else "Select Files (Multi-Select Support)",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FileTypeChip(icon = Icons.Default.Photo, label = if (isHindi) "तस्वीरें" else "Photos", modifier = Modifier.weight(1f))
                FileTypeChip(icon = Icons.Default.Videocam, label = if (isHindi) "वीडियो" else "Videos", modifier = Modifier.weight(1f))
                FileTypeChip(icon = Icons.Default.Description, label = if (isHindi) "दस्तावेज़" else "Docs", modifier = Modifier.weight(1f))
                FileTypeChip(icon = Icons.Default.Folder, label = if (isHindi) "अन्य" else "All Files", modifier = Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Active Transfer Queue Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isHindi) "सक्रिय ट्रांसफर कतार (${queue.size})" else "Active Queue (${queue.size})",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                TextButton(onClick = { showConsentDialog = true }) {
                    Text(
                        text = if (isHindi) "सहमति परीक्षण (Consent)" else "Test Consent",
                        color = CyanAccent,
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
        }

        // Transfer Queue Items
        items(queue) { item ->
            TransferItemCard(item = item, isHindi = isHindi)
            Spacer(modifier = Modifier.height(8.dp))
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))

            // 64KB Chunk Architecture Notice
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Default.Memory, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isHindi) "मेमोरी सुरक्षा: 64KB चंक स्ट्रीमिंग" else "Zero RAM Bloat: 64KB Chunking",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = TextPrimary)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (isHindi)
                            "सुपर ट्रांसफर में फाइल्स सीधे डिस्क से स्ट्रीम होती हैं। 4GB+ 4K वीडियो या बैकअप आर्काइव भेजने पर भी फोन कभी हैंग या क्रैश नहीं होता।"
                        else
                            "Streams files via 64KB bounded socket buffers. Large 4GB+ videos or full backups stream seamlessly without memory exhaustion.",
                        style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }

    // Explicit Receiver Consent Dialog
    if (showConsentDialog) {
        AlertDialog(
            onDismissRequest = { showConsentDialog = false },
            icon = {
                Icon(imageVector = Icons.Default.Security, contentDescription = null, tint = AmberAccent, modifier = Modifier.size(32.dp))
            },
            title = {
                Text(
                    text = if (isHindi) "आने वाली फाइल स्वीकार करें?" else "Incoming File Request",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = if (isHindi)
                            "डिवाइस 'Pixel 8 Pro (582-914)' आपको एक 2.45 GB वीडियो फाइल भेजना चाहता है।\n\nफाइल: 4K_Camera_Teardown.mp4\nसुरक्षा: SHA-256 सत्यापित"
                        else
                            "Device 'Pixel 8 Pro (582-914)' wants to send you a 2.45 GB video file.\n\nFile: 4K_Camera_Teardown.mp4\nIntegrity: SHA-256 Verified",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showConsentDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark)
                ) {
                    Text(text = if (isHindi) "स्वीकार करें (Accept)" else "Accept File")
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

    // QR Pair Dialog
    if (showQrDialog) {
        AlertDialog(
            onDismissRequest = { showQrDialog = false },
            title = {
                Text(
                    text = if (isHindi) "कनेक्ट करने के लिए स्कैन करें" else "Scan QR to Pair",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Box(
                        modifier = Modifier
                            .size(160.dp)
                            .background(Color.White, RoundedCornerShape(12.dp))
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
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = if (isHindi) "पिन कोड: $pairingCode" else "PIN Code: $pairingCode",
                        style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
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
}

@Composable
private fun FileTypeChip(icon: ImageVector, label: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
            .clickable { /* Trigger File Picker */ }
            .padding(vertical = 10.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(imageVector = icon, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = label, style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, color = TextPrimary))
        }
    }
}

@Composable
private fun TransferItemCard(item: TransferFileItem, isHindi: Boolean) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
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
                        imageVector = if (item.status == TransferStatus.COMPLETED) Icons.Default.CheckCircle else Icons.Default.InsertDriveFile,
                        contentDescription = null,
                        tint = if (item.status == TransferStatus.COMPLETED) EmeraldAccent else CyanAccent,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = item.name,
                            style = MaterialTheme.typography.titleMedium.copy(fontSize = 13.sp, fontWeight = FontWeight.SemiBold),
                            maxLines = 1
                        )
                        Text(
                            text = "${(item.sizeBytes / 1_000_000.0).format(1)} MB • ${if (item.status == TransferStatus.COMPLETED) (if (isHindi) "पूर्ण (SHA-256 सत्यापित)" else "Completed (SHA-256 Verified)") else "${(item.progress * 100).toInt()}%"}",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = if (item.status == TransferStatus.COMPLETED) EmeraldAccent else TextMuted
                            )
                        )
                    }
                }

                if (item.status == TransferStatus.TRANSFERRING) {
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        IconButton(onClick = {}, modifier = Modifier.size(28.dp)) {
                            Icon(imageVector = Icons.Default.Pause, contentDescription = "Pause", tint = AmberAccent, modifier = Modifier.size(16.dp))
                        }
                        IconButton(onClick = {}, modifier = Modifier.size(28.dp)) {
                            Icon(imageVector = Icons.Default.Close, contentDescription = "Cancel", tint = RoseAccent, modifier = Modifier.size(16.dp))
                        }
                    }
                }
            }

            if (item.status == TransferStatus.TRANSFERRING) {
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = { item.progress },
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

private fun Double.format(digits: Int) = "%.${digits}f".format(this)
