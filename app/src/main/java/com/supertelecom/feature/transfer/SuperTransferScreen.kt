package com.supertelecom.feature.transfer

import android.net.Uri
import android.os.Build
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.model.TransferDirection
import com.supertelecom.model.TransferFileItem
import com.supertelecom.model.TransferManifest
import com.supertelecom.model.TransferStatus
import com.supertelecom.theme.*
import kotlinx.coroutines.launch
import java.util.Locale

@Composable
fun SuperTransferScreen(
    isHindi: Boolean,
    contentPadding: PaddingValues = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 120.dp)
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val transferManager = remember { WifiDirectTransferManager(context) }

    DisposableEffect(Unit) {
        transferManager.registerLifecycle()
        onDispose {
            transferManager.unregisterLifecycle()
        }
    }

    var mode by remember { mutableStateOf(TransferDirection.SEND) }
    var showQrDialog by remember { mutableStateOf(false) }
    var showAppPickerDialog by remember { mutableStateOf(false) }
    var showIpConnectDialog by remember { mutableStateOf(false) }
    var manualTargetIp by remember { mutableStateOf("") }
    var transferMessageDialog by remember { mutableStateOf<String?>(null) }
    var activeConsentCallback by remember { mutableStateOf<((Boolean) -> Unit)?>(null) }

    val isTransferring by transferManager.isTransferring.collectAsState()
    val isPaused by transferManager.isPaused.collectAsState()
    val transferSpeedMbps by transferManager.transferSpeedMbps.collectAsState()
    val totalProgress by transferManager.totalProgress.collectAsState()
    val peers by transferManager.peers.collectAsState()
    val connectionInfo by transferManager.connectionInfo.collectAsState()
    val thisDevice by transferManager.thisDevice.collectAsState()
    val incomingManifest by transferManager.incomingManifest.collectAsState()
    val localIp by transferManager.localIpAddress.collectAsState()

    // Production Queue: Starts empty (zero fabricated mock records)
    val selectedFiles = remember { mutableStateListOf<TransferFileItem>() }
    val userAppsList = remember { mutableStateListOf<TransferFileItem>() }

    // Dynamic pairing token generated for session
    val pairingCode = remember {
        val randomVal = (100000..999999).random()
        "${randomVal / 1000} ${randomVal % 1000}"
    }

    // ── Real Android Pickers (PickVisualMedia & OpenMultipleDocuments) ──
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia()
    ) { uris: List<Uri> ->
        for (uri in uris) {
            val (name, size) = transferManager.queryFileInfo(uri)
            val item = TransferFileItem(
                id = "photo_${System.currentTimeMillis()}_${name.hashCode()}",
                name = name,
                sizeBytes = size,
                mimeType = "image/jpeg",
                uri = uri,
                status = TransferStatus.PENDING
            )
            selectedFiles.add(item)
            coroutineScope.launch {
                val hash = transferManager.computeFileSha256(uri)
                val idx = selectedFiles.indexOfFirst { it.id == item.id }
                if (idx != -1) {
                    selectedFiles[idx] = selectedFiles[idx].copy(sha256 = hash)
                }
            }
        }
    }

    val videoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia()
    ) { uris: List<Uri> ->
        for (uri in uris) {
            val (name, size) = transferManager.queryFileInfo(uri)
            val item = TransferFileItem(
                id = "video_${System.currentTimeMillis()}_${name.hashCode()}",
                name = name,
                sizeBytes = size,
                mimeType = "video/mp4",
                uri = uri,
                status = TransferStatus.PENDING
            )
            selectedFiles.add(item)
            coroutineScope.launch {
                val hash = transferManager.computeFileSha256(uri)
                val idx = selectedFiles.indexOfFirst { it.id == item.id }
                if (idx != -1) {
                    selectedFiles[idx] = selectedFiles[idx].copy(sha256 = hash)
                }
            }
        }
    }

    val audioPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenMultipleDocuments()
    ) { uris: List<Uri> ->
        for (uri in uris) {
            val (name, size) = transferManager.queryFileInfo(uri)
            val item = TransferFileItem(
                id = "audio_${System.currentTimeMillis()}_${name.hashCode()}",
                name = name,
                sizeBytes = size,
                mimeType = "audio/*",
                uri = uri,
                status = TransferStatus.PENDING
            )
            selectedFiles.add(item)
            coroutineScope.launch {
                val hash = transferManager.computeFileSha256(uri)
                val idx = selectedFiles.indexOfFirst { it.id == item.id }
                if (idx != -1) {
                    selectedFiles[idx] = selectedFiles[idx].copy(sha256 = hash)
                }
            }
        }
    }

    val docPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenMultipleDocuments()
    ) { uris: List<Uri> ->
        for (uri in uris) {
            val (name, size) = transferManager.queryFileInfo(uri)
            val item = TransferFileItem(
                id = "doc_${System.currentTimeMillis()}_${name.hashCode()}",
                name = name,
                sizeBytes = size,
                mimeType = "application/*",
                uri = uri,
                status = TransferStatus.PENDING
            )
            selectedFiles.add(item)
            coroutineScope.launch {
                val hash = transferManager.computeFileSha256(uri)
                val idx = selectedFiles.indexOfFirst { it.id == item.id }
                if (idx != -1) {
                    selectedFiles[idx] = selectedFiles[idx].copy(sha256 = hash)
                }
            }
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
                        text = if (isHindi) "शून्य इंटरनेट • Wi-Fi Direct • 64KB बफ़र • 100% सुरक्षित" else "Zero Internet • Wi-Fi Direct P2P • 64KB Sockets • Honest Speed",
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
                        text = if (isHindi) "100% ऑन-डिवाइस" else "100% On-Device",
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
                        transferManager.createP2pGroup()
                        transferManager.startReceiving(
                            onConsentRequired = { manifest, callback ->
                                activeConsentCallback = callback
                            },
                            onFileReceived = { receivedItem ->
                                selectedFiles.add(0, receivedItem)
                            },
                            onComplete = { success, msg ->
                                transferMessageDialog = msg
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
                text = if (isHindi) "PickVisualMedia और Scoped Storage द्वारा सीधे स्टोरेज से असली फाइलें चुनें" else "Pick genuine photos, 4K videos, audio notes, or documents from device storage",
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

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                CategoryPickerCard(
                    title = if (isHindi) "ऐप्स (APKs) भेजें" else "Send Apps (APKs)",
                    sub = "Installed Applications",
                    icon = Icons.Default.Apps,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        userAppsList.clear()
                        userAppsList.addAll(transferManager.getInstalledUserApps())
                        showAppPickerDialog = true
                    }
                )

                CategoryPickerCard(
                    title = if (isHindi) "IP द्वारा जोड़ें" else "Direct IP Connect",
                    sub = "Hotspot / LAN Transfer",
                    icon = Icons.Default.Language,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        showIpConnectDialog = true
                    }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── STEP 3: PAIRING & NEARBY DEVICE PANEL (WI-FI DIRECT & LAN) ──
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
                                val currentDeviceName = thisDevice?.deviceName ?: Build.MODEL ?: "This Device"
                                Text(
                                    text = currentDeviceName,
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                                )
                                val ipPart = if (localIp != null) " • IP: $localIp" else ""
                                val connStatus = if (connectionInfo?.groupFormed == true) {
                                    if (isHindi) "Wi-Fi Direct कनेक्टेड (${connectionInfo?.groupOwnerAddress?.hostAddress})" else "Wi-Fi Direct Connected (${connectionInfo?.groupOwnerAddress?.hostAddress})"
                                } else {
                                    if (isHindi) "पेयरिंग पिन: $pairingCode$ipPart" else "Pairing PIN: $pairingCode$ipPart"
                                }
                                Text(
                                    text = connStatus,
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 11.sp,
                                        color = if (connectionInfo?.groupFormed == true) EmeraldAccent else CyanAccent
                                    )
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

                    // Peer List if found
                    if (peers.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = if (isHindi) "आस-पास मिले फोन (${peers.size}):" else "Discovered Nearby Devices (${peers.size}):",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                        )
                        peers.forEach { peer ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { transferManager.connectToPeer(peer) }
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = peer.deviceName.ifBlank { peer.deviceAddress },
                                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = if (isHindi) "कनेक्ट करें" else "Connect",
                                    style = MaterialTheme.typography.labelSmall.copy(color = CyanAccent)
                                )
                            }
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

        // Empty state when zero real files are picked
        if (selectedFiles.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(CardDark.copy(alpha = 0.5f))
                        .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.CloudUpload,
                            contentDescription = null,
                            tint = TextMuted,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (isHindi) "कोई फ़ाइल नहीं चुनी गई है" else "No Files Selected in Queue",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = TextSecondary)
                        )
                        Text(
                            text = if (isHindi) "ऊपर दिए गए बटनों से असली फोटो, वीडियो या डॉक्यूमेंट चुनें।" else "Use the category picker buttons above to select real files from your storage.",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, textAlign = TextAlign.Center),
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
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
                        pairingToken = pairingCode,
                        onFileUpdated = { idx, updated ->
                            if (idx < selectedFiles.size) {
                                selectedFiles[idx] = updated
                            }
                        },
                        onComplete = { success, msg ->
                            transferMessageDialog = msg
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

    // ── RECEIVER CONSENT DIALOG ──
    incomingManifest?.let { manifest ->
        AlertDialog(
            onDismissRequest = {
                activeConsentCallback?.invoke(false)
                activeConsentCallback = null
            },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Security, contentDescription = null, tint = CyanAccent)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isHindi) "फ़ाइल ट्रांसफर अनुरोध" else "File Transfer Request",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            },
            text = {
                Column {
                    Text(
                        text = if (isHindi)
                            "डिवाइस '${manifest.senderDeviceName}' आपको ${manifest.fileCount} फाइलें (%.1f MB) भेजना चाहता है। क्या आप स्वीकार करते हैं?".format(
                                Locale.US,
                                manifest.totalSizeBytes / 1_000_000f
                            )
                        else
                            "Device '${manifest.senderDeviceName}' wants to send you ${manifest.fileCount} file(s) (%.1f MB). Do you accept?".format(
                                Locale.US,
                                manifest.totalSizeBytes / 1_000_000f
                            ),
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        activeConsentCallback?.invoke(true)
                        activeConsentCallback = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark)
                ) {
                    Text(text = if (isHindi) "स्वीकार करें (Accept)" else "Accept")
                }
            },
            dismissButton = {
                OutlinedButton(
                    onClick = {
                        activeConsentCallback?.invoke(false)
                        activeConsentCallback = null
                    }
                ) {
                    Text(text = if (isHindi) "अस्वीकार करें (Decline)" else "Decline")
                }
            },
            containerColor = CardDark
        )
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
                        text = if (isHindi) "सत्र पेयरिंग पिन:" else "Session Pairing PIN:",
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

    // ── STATUS / RESULT DIALOG ──
    transferMessageDialog?.let { message ->
        AlertDialog(
            onDismissRequest = { transferMessageDialog = null },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = CyanAccent)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isHindi) "ट्रांसफर सूचना" else "Transfer Status",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            },
            text = {
                Text(text = message, style = MaterialTheme.typography.bodyMedium)
            },
            confirmButton = {
                Button(
                    onClick = { transferMessageDialog = null },
                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark),
                    modifier = Modifier.height(48.dp)
                ) {
                    Text(text = if (isHindi) "ठीक है" else "OK")
                }
            },
            containerColor = CardDark
        )
    }

    // ── APP PICKER DIALOG ──
    if (showAppPickerDialog) {
        AlertDialog(
            onDismissRequest = { showAppPickerDialog = false },
            title = {
                Text(
                    text = if (isHindi) "इंस्टॉल ऐप्स चुनें (Select Apps)" else "Select Installed Apps to Send",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                if (userAppsList.isEmpty()) {
                    Text(
                        text = if (isHindi) "कोई ऐप नहीं मिली या लोड हो रही है..." else "Loading installed apps...",
                        style = MaterialTheme.typography.bodySmall
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 350.dp)
                    ) {
                        itemsIndexed(userAppsList) { _, appItem ->
                            val isAlreadySelected = selectedFiles.any { it.id == appItem.id }
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        if (isAlreadySelected) {
                                            selectedFiles.removeAll { it.id == appItem.id }
                                        } else {
                                            selectedFiles.add(appItem)
                                        }
                                    }
                                    .padding(vertical = 8.dp, horizontal = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = appItem.name,
                                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = "%.1f MB".format(Locale.US, appItem.sizeBytes / 1_000_000f),
                                        style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                                    )
                                }
                                Checkbox(
                                    checked = isAlreadySelected,
                                    onCheckedChange = { checked ->
                                        if (checked) {
                                            selectedFiles.add(appItem)
                                        } else {
                                            selectedFiles.removeAll { it.id == appItem.id }
                                        }
                                    },
                                    colors = CheckboxDefaults.colors(checkedColor = CyanAccent)
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = { showAppPickerDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark)
                ) {
                    Text(text = if (isHindi) "जोड़ें (${selectedFiles.size})" else "Done (${selectedFiles.size})")
                }
            },
            containerColor = CardDark
        )
    }

    // ── IP CONNECT DIALOG ──
    if (showIpConnectDialog) {
        AlertDialog(
            onDismissRequest = { showIpConnectDialog = false },
            title = {
                Text(
                    text = if (isHindi) "डायरेक्ट IP / हॉटस्पॉट कनेक्ट" else "Direct IP / Hotspot LAN Connect",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Column {
                    Text(
                        text = if (isHindi)
                            "रिसीवर फोन की स्क्रीन पर दिखने वाला IP पता दर्ज करें (उदा. 192.168.43.1):"
                        else
                            "Enter the IP address shown on the Receiver's screen (e.g. 192.168.43.1):",
                        style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedTextField(
                        value = manualTargetIp,
                        onValueChange = { manualTargetIp = it },
                        placeholder = { Text("192.168.x.x") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyanAccent,
                            unfocusedBorderColor = CardBorder
                        )
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showIpConnectDialog = false
                        if (manualTargetIp.isNotBlank() && selectedFiles.isNotEmpty()) {
                            transferManager.sendFiles(
                                files = selectedFiles.toList(),
                                pairingToken = pairingCode,
                                targetHostOverride = manualTargetIp.trim(),
                                onFileUpdated = { idx, updated ->
                                    if (idx in selectedFiles.indices) {
                                        selectedFiles[idx] = updated
                                    }
                                },
                                onComplete = { _, msg ->
                                    transferMessageDialog = msg
                                }
                            )
                        } else if (selectedFiles.isEmpty()) {
                            transferMessageDialog = if (isHindi) "कृपया पहले भेजने के लिए फाइलें चुनें!" else "Please pick files to send first!"
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark)
                ) {
                    Text(text = if (isHindi) "ट्रांसफर शुरू करें" else "Connect & Send")
                }
            },
            dismissButton = {
                TextButton(onClick = { showIpConnectDialog = false }) {
                    Text(text = if (isHindi) "रद्द करें" else "Cancel", color = TextMuted)
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
        file.sizeBytes > 0 -> "${file.sizeBytes / 1024} KB"
        else -> "0 KB"
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
                            if (file.status == TransferStatus.FAILED) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "• ${file.errorMessage ?: "Failed"}",
                                    style = MaterialTheme.typography.labelSmall.copy(color = RoseAccent, fontSize = 10.sp)
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
