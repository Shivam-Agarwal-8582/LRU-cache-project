package com.example.controller;

import com.example.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cache")
public class CacheController {

    private final CacheService cacheService;

    @Autowired
    public CacheController(CacheService cacheService) {
        this.cacheService = cacheService;
    }

    @GetMapping("/{key}")
    public ResponseEntity<?> get(@PathVariable String key) {
        String value = cacheService.get(key);
        if (value == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("key", key, "value", value));
    }

    @PutMapping
    public ResponseEntity<?> put(@RequestBody Map<String, String> payload) {
        String key = payload.get("key");
        String value = payload.get("value");
        if (key == null || value == null) {
            return ResponseEntity.badRequest().body("Missing 'key' or 'value' in request body");
        }
        cacheService.put(key, value);
        return ResponseEntity.ok(Map.of("status", "saved", "key", key));
    }
}
