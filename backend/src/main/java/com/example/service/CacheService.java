package com.example.service;

import com.example.cache.LRUCache;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service layer that holds a single LRUCache instance.
 */
@Service
public class CacheService {
    private final LRUCache<String, String> cache;

    public CacheService(@Value("${cache.capacity:5}") int capacity) {
        this.cache = new LRUCache<>(capacity);
    }

    public String get(String key) {
        return cache.get(key);
    }

    public void put(String key, String value) {
        cache.put(key, value);
    }

    public int size() {
        return cache.size();
    }
}
