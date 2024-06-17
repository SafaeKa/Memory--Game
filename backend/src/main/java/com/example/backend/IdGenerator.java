package com.example.backend;

public class IdGenerator {
    private static Long lastId = 0L;

    public static synchronized Long generateId() {
        lastId++;
        return lastId;
    }}
