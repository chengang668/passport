package com.cg.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Timer;
import java.util.TimerTask; 

public class myTimeoutTest {

	public static class MyTimeoutException extends RuntimeException{
		MyTimeoutException(){
			super();
		}
	}
	private static class MyTask extends TimerTask {
		public Thread threadToMonitor;
		
		MyTask(Thread threadToMonitor){
			super();
			this.threadToMonitor = threadToMonitor;
		}
		public void run() {
			threadToMonitor.interrupt(); 
			System.out.println("=========Timer Task ThreadID: " + Thread.currentThread().getId());
			System.out.println("=========Interrupt Thread: " + threadToMonitor.getId());
			// throw new MyTimeoutException(); // 时间到就抛出异常，结束程序
		}
	}

	public static void fun(int timeout) throws InterruptedException {
		Timer t = new Timer();
		t.schedule(new MyTask(Thread.currentThread()), timeout);
		// ....//do something;
		System.out.println("=========Main ThreadID: " + Thread.currentThread().getId());
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		while (true){
			try {
				String str = br.readLine().trim();
				System.out.println(str);
				if (str.compareTo("exit")==0) {
					t.cancel();// 执行完操作但没有超时，就取消Timer
					Thread.sleep(50000);
					break;
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println(" =========CG: " + e.getMessage());
			}
		}
	}

	public static void main(String[] args) {

		try {
			myTimeoutTest.fun(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			System.out.print(" ============ cg: interrupted =================");
		}
	}

}
