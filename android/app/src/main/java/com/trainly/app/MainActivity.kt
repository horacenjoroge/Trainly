package com.trainly.app
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.trainly.app.data.local.SessionManager
import com.trainly.app.ui.navigation.NavGraph
import com.trainly.app.ui.theme.TrainlyTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    @Inject lateinit var sessionManager: SessionManager
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TrainlyTheme {
                Surface(modifier = Modifier.fillMaxSize()) { NavGraph(sm = sessionManager) }
            }
        }
    }
}
