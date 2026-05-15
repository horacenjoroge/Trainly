package com.trainly.app.utils
import java.text.SimpleDateFormat
import java.util.*
object DateUtils {
    fun formatTimeAgo(d: String?): String { if(d.isNullOrBlank())return"just now"; return try{ val now=Date(); val df=now.time-SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply{timeZone=TimeZone.getTimeZone("UTC")}.parse(d)?.time?:0; val min=df/(1000*60); when{min<1->"just now";min<60->"${min}m ago";min<1440->"${min/60}h ago";min<2880->"yesterday";min<10080->"${min/1440}d ago";else->SimpleDateFormat("MMM d", Locale.US).format(Date(now.time-df))} }catch(_:Exception){"just now"} }
    fun formatDuration(m:Int):String = if(m<60)"${m}m" else if(m%60==0)"${m/60}h" else "${m/60}h ${m%60}m"
    fun formatDurationSeconds(s:Int):String = "${s/60}:${"%02d".format(s%60)}"
}
