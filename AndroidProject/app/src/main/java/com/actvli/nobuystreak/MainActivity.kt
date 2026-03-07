package com.actvli.nobuystreak

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.graphics.toColorInt
import androidx.core.net.toUri
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat

private const val APP_URL = "https://nobuystreak.actvli.com"

class MainActivity : ComponentActivity() {

    private var webView: WebView? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Edge-to-edge dark status/nav bars matching the app theme
        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowInsetsControllerCompat(window, window.decorView).apply {
            isAppearanceLightStatusBars = false
            isAppearanceLightNavigationBars = false
        }

        setContent {
            var isLoading by remember { mutableStateOf(true) }
            var canGoBack by remember { mutableStateOf(false) }

            BackHandler(enabled = canGoBack) {
                webView?.goBack()
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(ComposeColor(0xFF0A0A0A))
            ) {
                AndroidView(
                    factory = { ctx ->
                        WebView(ctx).apply {
                            webView = this

                            settings.apply {
                                javaScriptEnabled = true
                                domStorageEnabled = true  // required for auth session storage
                                setSupportZoom(false)
                                builtInZoomControls = false
                                displayZoomControls = false
                                useWideViewPort = true
                                loadWithOverviewMode = true
                                @Suppress("DEPRECATION")
                                mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW
                            }

                            setBackgroundColor("#0a0a0a".toColorInt())

                            webViewClient = object : WebViewClient() {
                                override fun shouldOverrideUrlLoading(
                                    view: WebView,
                                    request: WebResourceRequest
                                ): Boolean {
                                    val url = request.url.toString()
                                    // Keep all app URLs inside the WebView
                                    if (url.startsWith(APP_URL)) return false
                                    // Google OAuth + external links open in the system browser
                                    // (Google blocks OAuth inside embedded WebViews)
                                    startActivity(Intent(Intent.ACTION_VIEW, url.toUri()))
                                    return true
                                }

                                override fun onPageFinished(view: WebView, url: String) {
                                    isLoading = false
                                    canGoBack = view.canGoBack()
                                }
                            }

                            webChromeClient = WebChromeClient()
                            loadUrl(APP_URL)
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )

                // Gold spinner on dark background while the page loads
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = ComposeColor(0xFFF0C040)
                    )
                }
            }
        }
    }

    // Called when a deep link re-opens this already-running activity (e.g. OAuth callback)
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        intent.data?.let { uri ->
            val url = uri.toString()
            if (url.startsWith(APP_URL)) {
                webView?.loadUrl(url)
            }
        }
    }
}
