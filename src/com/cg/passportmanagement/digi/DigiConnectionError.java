package com.cg.passportmanagement.digi;

public class DigiConnectionError extends RuntimeException {
	public DigiConnectionError(String cause){
		super( cause );
	}
}
