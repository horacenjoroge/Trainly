package com.trainly.app.utils

import java.text.SimpleDateFormat
import java.util.*

object DateUtils {

    fun formatTimeAgo(d: String?): String {
        if (d.isNullOrBlank()) return "just now"
        return try {
            val now = Date()
            val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
            sdf.timeZone = TimeZone.getTimeZone("UTC")
            val date = sdf.parse(d)
            if (date == null) return "just now"
            val diffMs = now.time - date.time
            val minutes = diffMs / (1000 * 60)
            when {
                minutes < 1 -> "just now"
                minutes < 60 -> "${minutes}m ago"
                minutes < 1440 -> "${minutes / 60}h ago"
                minutes < 2880 -> "yesterday"
                minutes < 10080 -> "${minutes / 1440}d ago"
                else -> SimpleDateFormat("MMM d", Locale.US).format(date)
            }
        } catch (_: Exception) {
            "just now"
        }
    }

    fun formatDuration(m: Int): String {
        return if (m < 60) "${m}m"
        else if (m % 60 == 0) "${m / 60}h"
        else "${m / 60}h ${m % 60}m"
    }

    fun formatDurationSeconds(s: Int): String {
        return "${s / 60}:${"%02d".format(s % 60)}"
    }

    fun formatDate(d: String?): String {
        if (d.isNullOrBlank()) return "--"
        return try {
            val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
            sdf.timeZone = TimeZone.getTimeZone("UTC")
            val date = sdf.parse(d) ?: return "--"
            SimpleDateFormat("MMM d, yyyy", Locale.US).format(date)
        } catch (_: Exception) { "--" }
    }
}
