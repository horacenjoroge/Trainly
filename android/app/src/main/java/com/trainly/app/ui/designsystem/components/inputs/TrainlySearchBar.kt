package com.trainly.app.ui.designsystem.components.inputs

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.trainly.app.ui.designsystem.theme.Radii
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme

@Composable
fun TrainlySearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    placeholder: String = "Search...",
    modifier: Modifier = Modifier,
    leadingIcon: @Composable (() -> Unit)? = { Text("\uD83D\uDD0D") }
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        placeholder = { Text(placeholder) },
        leadingIcon = leadingIcon,
        singleLine = true,
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = Spacing.lg, vertical = Spacing.sm),
        shape = RoundedCornerShape(Radii.md),
        colors = OutlinedTextFieldDefaults.colors(
            unfocusedBorderColor = com.trainly.app.ui.designsystem.theme.TrainlyColors.Gray200
        )
    )
}

@Preview
@Composable
private fun TrainlySearchBarPreview() {
    TrainlyTheme {
        TrainlySearchBar(
            query = "",
            onQueryChange = {}
        )
    }
}
