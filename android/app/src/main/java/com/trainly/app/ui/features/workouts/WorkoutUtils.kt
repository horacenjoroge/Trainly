package com.trainly.app.ui.features.workouts

import com.trainly.app.data.remote.dto.WorkoutDto

data class GpsCoordinate(
    val latitude: Double,
    val longitude: Double,
    val altitude: Double = 0.0,
    val timestamp: Long = System.currentTimeMillis(),
    val speed: Float = 0f
)

fun formatDuration(s: Int): String {
    val h = s / 3600
    val m = (s % 3600) / 60
    val sec = s % 60
    return if (h > 0) "%02d:%02d:%02d".format(h, m, sec) else "%02d:%02d".format(m, sec)
}

fun formatPace(km: Double, sec: Int): String {
    if (km <= 0 || sec <= 0) return "--:--"
    val spk = sec / km
    return "%d:%02d".format((spk / 60).toInt(), (spk % 60).toInt())
}

fun formatDistance(m: Double): String {
    return if (m >= 1000) "%.2f km".format(m / 1000) else "%.0f m".format(m)
}

fun calculateDistance(p1: GpsCoordinate, p2: GpsCoordinate): Double {
    val R = 6371000.0
    val dLat = Math.toRadians(p2.latitude - p1.latitude)
    val dLon = Math.toRadians(p2.longitude - p1.longitude)
    val sin1 = Math.sin(dLat / 2.0)
    val cos1 = Math.cos(Math.toRadians(p1.latitude))
    val cos2 = Math.cos(Math.toRadians(p2.latitude))
    val a = sin1 * sin1 + cos1 * cos2 * Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0)
    return R * 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a))
}

fun WorkoutDto.distanceMeters(): Double {
    return distance
        ?: running?.distance
        ?: cycling?.distance
        ?: swimming?.distance
        ?: 0.0
}

fun WorkoutDto.averagePaceSeconds(): Int? {
    val actualPace = running?.pace?.average
    if (actualPace != null && actualPace > 0) return actualPace.toInt()
    val km = distanceMeters() / 1000.0
    val totalSeconds = duration ?: 0
    return if (km > 0 && totalSeconds > 0) (totalSeconds / km).toInt() else null
}

fun WorkoutDto.averageSpeedKmh(): Double? {
    val actualSpeed = cycling?.speed?.average ?: running?.speed?.average
    if (actualSpeed != null && actualSpeed > 0) return actualSpeed
    val km = distanceMeters() / 1000.0
    val totalSeconds = duration ?: 0
    return if (km > 0 && totalSeconds > 0) (km / (totalSeconds / 3600.0)) else null
}

fun WorkoutDto.hasRouteData(): Boolean {
    return running?.route?.gpsPoints?.isNotEmpty() == true || cycling?.route?.gpsPoints?.isNotEmpty() == true
}
