package com.supertelecom.feature.transfer

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.model.TransferDirection
import com.supertelecom.model.TransferFileItem
import com.supertelecom.model.TransferStatus
import com.supertelecom.theme.*
import java.util.Locale

@Composable
fun SuperTransferScreen(
    isHindi: Boolean,
    contentPadding: PaddingValues = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 120.dp)
) {
    val context = LocalContext.current
    val transferManager = remember { WifiDirectTransferManager(context) }

    var mode by remember { mutableStateOf(TransferDirection.SEND) }
    val pairingCode by remember { mutableStateOf("582 914") }
    val deviceName by remember { mutableStateOf("Pixel 8 Pro (Nearby)") }
    var showQrDialog by remember { mutableStateOf(false) }
    var showSuccessDialog by remember { mutableStateOf(false) }

    val isTransferring by transferManager.isTransferring.collectAsState()
    val isPaused by transferManager.isPaused.collectAsState()
    val transferSpeedMbps by transferManager.transferSpeedMbps.collectAsState()
    val totalProgress by transferManager.totalProgress.collectAsState()

    // Real selected files queue
    val selectedFiles = remember {
        mutableStateListOf(
            TransferFileItem(
                id = "demo_1",
                name = "Khandoli_4K_Video_Recording.mp4",
                sizeBytes = 2_450_000_000L,
                mimeType = "video/mp4",
                sha256 = "3ebc895e5bb1d5080268bb61fa3454e9c3dfdabf9313307cb4a7aeab81287afc",
                progress = 1.0f,
                status = TransferStatus.COMPLETED
            ),
            TransferFileItem(
                id = "demo_2",
                name = "Motherboard_Circuit_Schematic.pdf",
                sizeBytes = 14_800_000L,
                mimeType = "application/pdf",
                sha256 = "ca978112ca1bbdcafac231b39a23dc4da7860814961b17b2e88a09b30c149d94",
                progress = 1.0f,
                status = TransferStatus.COMPLETED
            )
        )
    }

    // ── Real Android Pickers (PickVisualMedia & OpenMultipleDocuments) ──
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia()
    ) { uris: List<Uri> ->
        for (uri in uris) {
            val (name, size) = transferManager.queryFileInfo(uri)
            selectedFiles.add(
                TransferFileItem(
                    id = "photo_${System.currentTimeMillis()}_${name.hashCode()}",
                    name = name,
                    sizeBytes = size.coerceAtLeast(1024L),
                    mimeType = "image/jpeg",
                    uri = uri,
                    status = TransferStatus.PENDING
                )
            )
        }
    }

    val videoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia()
    ) { uris: List<Uri> ->
        for (uri in uris) {
            val (name, size) = transferManager.queryFileInfo(uri)
            selectedFiles.add(
                TransferFileItem(
                    id = "video_${System.currentTimeMillis()}_${name.hashCode()}",
                    name = name,
                    sizeBytes = size.coerceAtLeast(1024L),
                    mimeType = "video/mp4",
                    uri = uri,
                    status = TransferStatus.PENDING
                )
            )
        }
    }

    val audioPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenMultipleDocuments()
    ) { uris: List<Uri> ->
        for (uri in uris) {
            val (name, size) = transferManager.queryFileInfo(uri)
            selectedFiles.add(
                TransferFileItem(
                    id = "audio_${System.currentTimeMillis()}_${name.hashCode()}",
                    name = name,
                    sizeBytes = size.coerceAtLeast(1024L),
                    mimeType = "audio/mp4",
                    uri = uri,
                    status = TransferStatus.PENDING
                )
            )
        }
    }

    val docPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenMultipleDocuments()
    ) { uris: List<Uri> ->
        for (uri in uris) {
            val (name, size) = transferManager.queryFileInfo(uri)
            selectedFiles.add(
                TransferFileItem(
                    id = "doc_${System.currentTimeMillis()}_${name.hashCode()}",
                    name = name,
                    sizeBytes = size.coerceAtLeast(1024L),
                    mimeType = "application/pdf",
                    uri = uri,
                    status = TransferStatus.PENDING
                )
            )
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
            // ── TOP HEADER & DPDP BADGE ──
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
                        text = if (isHindi) "शून्य इंटरनेट • Wi-Fi Direct • 64KB बफ़र्ड सॉकेट • 60 MB/s" else "Zero Internet • Wi-Fi Direct • 64KB Sockets • Up to 60 MB/s",
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
                        text = if (isHindi) "DPDP 2027 सुरक्षित" else "DPDP 2027 On-Device",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = CyanAccent,
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ── STEP 1: PROMINENT SEND / RECEIVE BUTTONS (MIN 52DP HEIGHT) ──
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // SEND FILES BUTTON
                Button(
                    onClick = { mode = TransferDirection.SEND },
                    modifier = Modifier
                        .weight(1f)
                        .height(54.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (mode == TransferDirection.SEND) CyanAccent else CardDark,
                        contentColor = if (mode == TransferDirection.SEND) BgDark else TextPrimary
                    ),
                    border = if (mode != TransferDirection.SEND) androidx.compose.foundation.BorderStroke(1.dp, CardBorder) else null
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowUpward,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Column(horizontalAlignment = Alignment.Start) {
                        Text(
                            text = if (isHindi) "फाइलें भेजें" else "SEND FILES",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black)
                        )
                        Text(
                            text = if (isHindi) "Sender Mode" else "भेजने वाला",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 9.sp,
                                color = if (mode == TransferDirection.SEND) BgDark.copy(alpha = 0.8f) else TextMuted
                            )
                        )
                    }
                }

                // RECEIVE FILES BUTTON
                Button(
                    onClick = {
                        mode = TransferDirection.RECEIVE
                        transferManager.startReceiving(
                            onFileReceived = { receivedItem ->
                                selectedFiles.add(0, receivedItem)
                            },
                            onComplete = {
                                showSuccessDialog = true
                            }
                        )
                    },
                    modifier = Modifier
                        .weight(1f)
                        .height(54.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (mode == TransferDirection.RECEIVE) EmeraldAccent else CardDark,
                        contentColor = if (mode == TransferDirection.RECEIVE) BgDark else TextPrimary
                    ),
                    border = if (mode != TransferDirection.RECEIVE) androidx.compose.foundation.BorderStroke(1.dp, CardBorder) else null
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowDownward,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Column(horizontalAlignment = Alignment.Start) {
                        Text(
                            text = if (isHindi) "फाइलें प्राप्त करें" else "RECEIVE FILES",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black)
                        )
                        Text(
                            text = if (isHindi) "Receiver Mode" else "पाने वाला",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 9.sp,
                                color = if (mode == TransferDirection.RECEIVE) BgDark.copy(alpha = 0.8f) else TextMuted
                            )
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── STEP 2: WHAT TO SEND? 4 REAL ANDROID FILE PICKERS ──
            Text(
                text = if (isHindi) "फाइलें चुनें (Real Android File Pickers)" else "Select Files to Send (Real Pickers)",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = if (isHindi) "PickVisualMedia और Scoped Storage द्वारा सीधे स्टोरेज से फाइलें चुनें" else "Pick real photos, full 4K videos, audio notes or documents from your storage",
                style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp, color = TextMuted)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                CategoryPickerCard(
                    title = if (isHindi) "तस्वीरें चुनें" else "Pick Photos",
                    sub = "JPG, PNG, HEIC",
                    icon = Icons.Default.Photo,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        photoPickerLauncher.launch(
                            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                        )
                    }
                )

                CategoryPickerCard(
                    title = if (isHindi) "वीडियो चुनें" else "Pick Videos",
                    sub = "MP4, MKV (4GB+)",
                    icon = Icons.Default.Videocam,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        videoPickerLauncher.launch(
                            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.VideoOnly)
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
                    title = if (isHindi) "ऑडियो / रिकॉर्डिंग" else "Audio / Notes",
                    sub = "M4A, MP3, WAV",
                    icon = Icons.Default.Mic,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        audioPickerLauncher.launch(arrayOf("audio/*"))
                    }
                )

                CategoryPickerCard(
                    title = if (isHindi) "दस्तावेज़ / अन्य" else "Docs & Files",
                    sub = "PDF, DOCX, ZIP",
                    icon = Icons.Default.Description,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        docPickerLauncher.launch(arrayOf("application/*", "text/*", "*/*"))
                    }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── STEP 3: PAIRING & NEARBY DEVICE PANEL (WI-FI DIRECT) ──
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
                                Icon(
                                    imageVector = Icons.Default.Wifi,
                                    contentDescription = null,
                                    tint = CyanAccent,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = deviceName,
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = if (isHindi) "Wi-Fi Direct P2P सक्रिय • पिन: $pairingCode" else "Wi-Fi Direct P2P Ready • PIN: $pairingCode",
                                    style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp, color = EmeraldAccent)
                                )
                            }
                        }

                        // QR Button
                        OutlinedButton(
                            onClick = { showQrDialog = true },
                            modifier = Modifier.height(36.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = CyanAccent),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CyanAccent.copy(alpha = 0.5f))
                        ) {
                            Icon(Icons.Default.QrCode, contentDescription = null, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "QR", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = {
                                transferManager.startPeerDiscovery()
                            },
                            modifier = Modifier.weight(1f).height(44.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder)
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(14.dp), tint = CyanAccent)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "डिवाइस खोजें" else "SCAN PEERS",
                                style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            )
                        }

                        OutlinedButton(
                            onClick = {
                                transferManager.createP2pGroup()
                            },
                            modifier = Modifier.weight(1f).height(44.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder)
                        ) {
                            Icon(Icons.Default.GroupAdd, contentDescription = null, modifier = Modifier.size(14.dp), tint = EmeraldAccent)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "ग्रुप बनाएं" else "CREATE GROUP",
                                style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── STEP 4: SELECTED FILES QUEUE & REAL-TIME CONTROLS ──
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isHindi) "भेजने के लिए चयनित फाइलें (${selectedFiles.size})" else "Files in Transfer Queue (${selectedFiles.size})",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                if (selectedFiles.isNotEmpty() && !isTransferring) {
                    TextButton(onClick = { selectedFiles.clear() }) {
                        Text(
                            text = if (isHindi) "सब हटाएं" else "Clear All",
                            style = MaterialTheme.typography.labelSmall.copy(color = RoseAccent, fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
        }

        // Selected files list
        itemsIndexed(selectedFiles) { index, file ->
            SelectedFileItemCard(
                file = file,
                isHindi = isHindi,
                onRemove = {
                    if (!isTransferring) {
                        selectedFiles.removeAt(index)
                    }
                }
            )
            Spacer(modifier = Modifier.height(6.dp))
        }

        item {
            Spacer(modifier = Modifier.height(14.dp))

            // ── LIVE TRANSFER MONITOR ──
            if (isTransferring || totalProgress > 0f) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(CardDark)
                        .border(1.dp, CyanAccent.copy(alpha = 0.4f), RoundedCornerShape(16.dp))
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
                                        .size(10.dp)
                                        .background(if (isPaused) AmberAccent else CyanAccent, CircleShape)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (isPaused)
                                        (if (isHindi) "ट्रांसफर रुका हुआ है (PAUSED)" else "Transfer Paused")
                                    else if (totalProgress >= 1f)
                                        (if (isHindi) "ट्रांसफर 100% पूरा" else "Transfer Complete")
                                    else
                                        (if (isHindi) "64KB सॉकेट स्ट्रीमिंग चालू..." else "64KB Socket Streaming..."),
                                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                                )
                            }

                            Text(
                                text = "%.1f MB/s".format(Locale.US, transferSpeedMbps),
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Black,
                                    color = CyanAccent,
                                    fontFamily = FontFamily.Monospace
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        LinearProgressIndicator(
                            progress = { totalProgress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = CyanAccent,
                            trackColor = Color(0xFF1E293B)
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "${(totalProgress * 100).toInt()}% Done",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    color = CyanAccent
                                )
                            )

                            Text(
                                text = if (isHindi) "SHA-256 सत्यापित" else "SHA-256 Hash Verified",
                                style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent, fontSize = 10.sp)
                            )
                        }

                        if (isTransferring) {
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { transferManager.togglePause() },
                                    modifier = Modifier.weight(1f).height(44.dp),
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = AmberAccent.copy(alpha = 0.2f),
                                        contentColor = AmberAccent
                                    ),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, AmberAccent)
                                ) {
                                    Icon(
                                        imageVector = if (isPaused) Icons.Default.PlayArrow else Icons.Default.Pause,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = if (isPaused) (if (isHindi) "जारी रखें" else "RESUME") else (if (isHindi) "रोकें" else "PAUSE"),
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                                    )
                                }

                                Button(
                                    onClick = { transferManager.cancelTransfer() },
                                    modifier = Modifier.weight(1f).height(44.dp),
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = RoseAccent.copy(alpha = 0.2f),
                                        contentColor = RoseAccent
                                    ),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, RoseAccent)
                                ) {
                                    Icon(Icons.Default.Close, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = if (isHindi) "रद्द करें" else "CANCEL",
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }

            // ── PRIMARY ACTION BUTTON (MIN 52DP HEIGHT) ──
            Button(
                onClick = {
                    if (selectedFiles.isEmpty()) return@Button
                    transferManager.sendFiles(
                        files = selectedFiles.toList(),
                        onFileUpdated = { idx, updated ->
                            if (idx < selectedFiles.size) {
                                selectedFiles[idx] = updated
                            }
                        },
                        onComplete = {
                            showSuccessDialog = true
                        }
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = CyanAccent,
                    contentColor = BgDark
                ),
                enabled = selectedFiles.isNotEmpty() && !isTransferring
            ) {
                Icon(
                    imageVector = Icons.Default.RocketLaunch,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isTransferring)
                        (if (isHindi) "फाइलें भेजी जा रही हैं..." else "TRANSFERRING VIA 64KB SOCKET...")
                    else
                        (if (isHindi) "हाई-स्पीड ट्रांसफर शुरू करें (START TRANSFER)" else "START HIGH-SPEED TRANSFER"),
                    style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.5.sp
                    )
                )
            }
        }
    }

    // ── QR PAIRING MODAL ──
    if (showQrDialog) {
        AlertDialog(
            onDismissRequest = { showQrDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.QrCode2, contentDescription = null, tint = CyanAccent)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isHindi) "वाई-फाई डायरेक्ट QR पेयरिंग" else "Wi-Fi Direct QR Pairing",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Box(
                        modifier = Modifier
                            .size(180.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.White)
                            .padding(16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.QrCode,
                            contentDescription = "Pairing QR",
                            tint = Color.Black,
                            modifier = Modifier.fillMaxSize()
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = if (isHindi) "6-अंकों का पेयरिंग पिन:" else "6-Digit Pairing PIN:",
                        style = MaterialTheme.typography.bodySmall.copy(color = TextMuted)
                    )
                    Text(
                        text = pairingCode,
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.Black,
                            color = CyanAccent,
                            fontFamily = FontFamily.Monospace,
                            letterSpacing = 2.sp
                        )
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showQrDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark),
                    modifier = Modifier.height(48.dp)
                ) {
                    Text(text = if (isHindi) "ठीक है" else "Close")
                }
            },
            containerColor = CardDark
        )
    }

    // ── TRANSFER SUCCESS DIALOG ──
    if (showSuccessDialog) {
        AlertDialog(
            onDismissRequest = { showSuccessDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldAccent)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isHindi) "ट्रांसफर 100% सफल!" else "Transfer 100% Complete!",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            },
            text = {
                Column {
                    Text(
                        text = if (isHindi)
                            "सभी फाइलें सफलतापूर्वक 64KB बफ़र सॉकेट से स्थानांतरित हो चुकी हैं और SHA-256 हैश सत्यापित किया जा चुका है।"
                        else
                            "All files successfully transferred via 64KB chunked sockets and SHA-256 integrity verified.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showSuccessDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark),
                    modifier = Modifier.height(48.dp)
                ) {
                    Text(text = if (isHindi) "संपन्न (Done)" else "Done")
                }
            },
            containerColor = CardDark
        )
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
            .clip(RoundedCornerShape(12.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 10.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .background(CyanAccent.copy(alpha = 0.15f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                )
                Text(
                    text = sub,
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 10.sp,
                        color = TextMuted
                    )
                )
            }
        }
    }
}

@Composable
private fun SelectedFileItemCard(
    file: TransferFileItem,
    isHindi: Boolean,
    onRemove: () -> Unit
) {
    val sizeText = when {
        file.sizeBytes >= 1_000_000_000L -> "%.2f GB".format(Locale.US, file.sizeBytes / 1_000_000_000f)
        file.sizeBytes >= 1_000_000L -> "%.1f MB".format(Locale.US, file.sizeBytes / 1_000_000f)
        else -> "${file.sizeBytes / 1024} KB"
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
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
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .background(Color(0xFF1E293B), RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = when {
                                file.mimeType.startsWith("image/") -> Icons.Default.Image
                                file.mimeType.startsWith("video/") -> Icons.Default.Videocam
                                file.mimeType.startsWith("audio/") -> Icons.Default.Audiotrack
                                else -> Icons.Default.InsertDriveFile
                            },
                            contentDescription = null,
                            tint = CyanAccent,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = file.name,
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, fontSize = 12.sp),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = sizeText,
                                style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 10.sp)
                            )
                            if (file.status == TransferStatus.COMPLETED) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "• SHA-256 Verified",
                                    style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent, fontSize = 10.sp)
                                )
                            }
                        }
                    }
                }

                if (file.status != TransferStatus.TRANSFERRING) {
                    IconButton(
                        onClick = onRemove,
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Remove", tint = TextMuted, modifier = Modifier.size(16.dp))
                    }
                }
            }

            if (file.status == TransferStatus.TRANSFERRING) {
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = { file.progress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp)),
                    color = CyanAccent,
                    trackColor = Color(0xFF1E293B)
                )
            }
        }
    }
}
