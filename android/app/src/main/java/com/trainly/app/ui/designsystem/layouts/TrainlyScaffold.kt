package com.trainly.app.ui.designsystem.layouts

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import com.trainly.app.ui.designsystem.navigation.TrainlyTopBar

enum class TopBarStyle {
    NONE,
    DEFAULT,
    CENTERED
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrainlyScaffold(
    topBarTitle: String? = null,
    topBarIcon: @Composable (() -> Unit)? = null,
    topBarIconContentDescription: String? = null,
    onTopBarIconClick: (() -> Unit)? = null,
    topBarActions: @Composable RowScope.() -> Unit = {},
    topBarStyle: TopBarStyle = TopBarStyle.DEFAULT,
    bottomBar: @Composable () -> Unit = {},
    fab: @Composable () -> Unit = {},
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() },
    content: @Composable (PaddingValues) -> Unit
) {
    Scaffold(
        modifier = Modifier.fillMaxSize(),
        topBar = {
            if (topBarTitle != null && topBarStyle != TopBarStyle.NONE) {
                TrainlyTopBar(
                    title = topBarTitle,
                    navigationIcon = topBarIcon,
                    navigationIconContentDescription = topBarIconContentDescription,
                    onNavigationClick = onTopBarIconClick,
                    actions = topBarActions
                )
            }
        },
        bottomBar = bottomBar,
        floatingActionButton = fab,
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
    ) { padding ->
        content(padding)
    }
}
