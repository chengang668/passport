package com.cg.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Timer;
import java.util.TimerTask; 

public class execTimeout {

	public static class MyTimeoutException extends RuntimeException{
		MyTimeoutException(){
			super();
		}
	}
	private static class MyTask extends TimerTask {
		public Process proc;
		public Timer timer;
		
		MyTask(Process proc, Timer timer){
			super();
			this.proc = proc;
			this.timer = timer;
		}
		public void run() {
			timer.cancel();
			proc.destroy(); 
			
			System.out.println("=========Killing python, Timer Task ThreadID: " + Thread.currentThread().getId());
		}
	} 

	public static void fun(int timeout) throws InterruptedException, IOException {
		
		Process proc = Runtime.getRuntime().exec("python c:\\ppt_who.py 16.158.154.242 23 chengang chengang");
		Timer t = new Timer();
		t.schedule(new MyTask(proc, t), timeout);
		
		System.out.println("=========Main ThreadID: " + Thread.currentThread().getId());
		BufferedReader br = new BufferedReader(new InputStreamReader(proc.getInputStream()));
		while (true){
			try {
				String str = br.readLine();
				if (str==null) {
					System.out.println(" Nothing, over " );
					break;
				}
				System.out.println(str);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println(" =========CG: " + e.getMessage());
			} catch (Exception e){
				System.out.println(" =========CG: " + e.getMessage());
				break;
			}
		}
		//t.purge();
		//t.cancel();
		// proc.waitFor();
		//br.close();
	}

	public static void main(String[] args) {

		try {
			execTimeout.fun(10000);
			System.out.print(" ============ fun over =================" );
		} catch (Exception e) {
			System.out.print(" ============ cg: interrupted =================" + e.getClass());
		}
	}

}

class cg_helper {
	int x;
}
