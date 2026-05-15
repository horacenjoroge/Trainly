package com.trainly.app.utils
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
class DateUtilsTest {
    @Test fun `null returns just now`() = assertEquals("just now", DateUtils.formatTimeAgo(null))
    @Test fun `blank returns just now`() = assertEquals("just now", DateUtils.formatTimeAgo(""))
    @Test fun `formatDuration under 60`() = assertEquals("45m", DateUtils.formatDuration(45))
    @Test fun `formatDuration hours and minutes`() = assertEquals("1h 30m", DateUtils.formatDuration(90))
    @Test fun `formatDurationSeconds`() = assertEquals("1:30", DateUtils.formatDurationSeconds(90))
    @Test fun `formatDurationSeconds pads`() = assertEquals("0:05", DateUtils.formatDurationSeconds(5))
}
