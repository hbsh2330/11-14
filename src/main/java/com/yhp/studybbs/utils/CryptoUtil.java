package com.yhp.studybbs.utils;

import java.math.BigInteger;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public final class CryptoUtil {
    public static String hashSha512(String input) {
        return CryptoUtil.hashSha512(input, StandardCharsets.UTF_8, null);
    }

    public static String hashSha512(String input, Charset charset) {
        return CryptoUtil.hashSha512(input, charset, null);
    }

    public static String hashSha512(String input, String fallback) {
        return CryptoUtil.hashSha512(input, StandardCharsets.UTF_8, fallback);
    }

    public static String hashSha512(String input, Charset charset, String fallback) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.reset();
            md.update(input.getBytes(charset));
            return String.format("%0128x", new BigInteger(1, md.digest()));
        } catch (Exception e) {
            return fallback;
        }
    }

    private CryptoUtil() {
        super();
    }
}