package com.reshitha.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServiceImpl implements OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpServiceImpl.class);
    // Key: email/username, Value: OTP
    // For a production app, use Redis or a DB with expiration.
    // Here we use a ConcurrentHashMap for simplicity, but we also need to handle
    // expiration logic manually or lazily.
    // For this implementation, we will store a wrapper object with timestamp.

    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; // 5 minutes

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    private static class OtpData {
        String otp;
        long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    @Override
    public String generateOtp(String key) {
        // Generate 6-digit OTP
        int otpValue = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpValue);

        OtpData apiData = new OtpData(otp, System.currentTimeMillis() + OTP_VALID_DURATION);
        otpStorage.put(key, apiData);

        logger.info("Generated OTP for {}: {}", key, otp);
        return otp;
    }

    @Override
    public boolean validateOtp(String key, String otp) {
        OtpData data = otpStorage.get(key);
        if (data == null) {
            return false;
        }

        if (System.currentTimeMillis() > data.expiryTime) {
            otpStorage.remove(key);
            return false;
        }

        if (data.otp.equals(otp)) {
            otpStorage.remove(key); // Invalidate after use
            return true;
        }

        return false;
    }
}
