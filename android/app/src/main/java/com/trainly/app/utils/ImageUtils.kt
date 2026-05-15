package com.trainly.app.utils
import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import android.provider.OpenableColumns
import java.io.File
import java.io.FileOutputStream
fun saveBitmapToTempFile(ctx:Context, b:Bitmap): Uri { val f=File(ctx.cacheDir, "trainly_${System.currentTimeMillis()}.jpg"); FileOutputStream(f).use{b.compress(Bitmap.CompressFormat.JPEG, 90, it)}; return Uri.fromFile(f) }
fun getFileName(ctx:Context, uri:Uri):String { var n="image.jpg"; ctx.contentResolver.query(uri,null,null,null,null)?.use{ val i=it.getColumnIndex(OpenableColumns.DISPLAY_NAME); if(it.moveToFirst()&&i>=0)n=it.getString(i) }; return n }
fun getFileSize(ctx:Context, uri:Uri):Long { var s=0L; ctx.contentResolver.query(uri,null,null,null,null)?.use{ val i=it.getColumnIndex(OpenableColumns.SIZE); if(it.moveToFirst()&&i>=0)s=it.getLong(i) }; return s }
