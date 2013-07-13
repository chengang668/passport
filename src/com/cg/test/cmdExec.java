package com.cg.test;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

public class cmdExec {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		if (0 < args.length) {
			for (String arg : args) {
				System.out.println(arg);
			}
		} else {
			Runtime rt = Runtime.getRuntime();
			Process test = rt.exec(new String[] { "java.exe", "com.cg.test.cmdExec",
					"1stArg=alpha", "2ndArg=beta charlie",
					"3rdArg=\"delta echo\"" });

			InputStream in = test.getInputStream();
			BufferedReader reader = new BufferedReader( new InputStreamReader(in));
			String line = null;
			while (null != (line = reader.readLine())) {
				System.out.println(line);
			}
		}
	} 
}
