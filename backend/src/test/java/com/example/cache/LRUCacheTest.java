package com.example.cache;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class LRUCacheTest {
    @Test
    public void testBasicPutAndGet() {
        LRUCache<String, String> cache = new LRUCache<>(2);
        cache.put("a", "1");
        cache.put("b", "2");
        assertEquals("1", cache.get("a"));
        assertEquals("2", cache.get("b"));
    }

    @Test
    public void testEvictionOrder() {
        LRUCache<String, String> cache = new LRUCache<>(2);
        cache.put("a", "1");
        cache.put("b", "2");
        // access a to make it most recent
        cache.get("a");
        // add c, should evict b
        cache.put("c", "3");
        assertNull(cache.get("b"));
        assertEquals("1", cache.get("a"));
        assertEquals("3", cache.get("c"));
    }

    @Test
    public void testUpdateExistingKey() {
        LRUCache<String, String> cache = new LRUCache<>(2);
        cache.put("a", "1");
        cache.put("a", "2");
        assertEquals("2", cache.get("a"));
        assertEquals(1, cache.size());
    }
}
