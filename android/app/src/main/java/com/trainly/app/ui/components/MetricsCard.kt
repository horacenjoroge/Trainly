package com.trainly.app.ui.components
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable fun MetricsCard(icon:String, value:String, label:String, onClick:(()->Unit)?=null, mod:Modifier=Modifier) {
    Card(onClick=onClick?:{}, modifier=mod, shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface), elevation=CardDefaults.cardElevation(2.dp)) {
        Column(Modifier.fillMaxSize().padding(12.dp), horizontalAlignment=Alignment.CenterHorizontally, verticalArrangement=Arrangement.Center) {
            Text(icon, style=MaterialTheme.typography.titleLarge); Spacer(Modifier.height(4.dp)); Text(value, fontWeight=FontWeight.Bold); Text(label, style=MaterialTheme.typography.bodySmall, color=MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
@Composable fun PeriodSelector(periods:List<String>, selected:String, onSelect:(String)->Unit, mod:Modifier=Modifier) {
    Row(mod.padding(horizontal=16.dp, vertical=8.dp), horizontalArrangement=Arrangement.spacedBy(8.dp)) { periods.forEach { FilterChip(selected=it==selected, onClick={onSelect(it)}, label={Text(it.replaceFirstChar{it.uppercase()})}, modifier=Modifier.weight(1f)) } }
}
