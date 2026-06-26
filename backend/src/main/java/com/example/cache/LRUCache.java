package com.example.cache;

import java.util.HashMap;
import java.util.Map;

/**
 * Generic Least Recently Used (LRU) cache implementation with O(1) get and put operations.
 *
 * @param <K> Type of the key
 * @param <V> Type of the value
 */
public class LRUCache<K, V> {
    private final int capacity;
    private final Map<K, Node<K, V>> map;
    private final DoublyLinkedList<K, V> list;

    public LRUCache(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be greater than 0");
        }
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.list = new DoublyLinkedList<>();
    }

    /**
     * Retrieves a value from the cache.
     *
     * @param key the key to look up
     * @return the associated value, or null if not present
     */
    public V get(K key) {
        Node<K, V> node = map.get(key);
        if (node == null) {
            return null;
        }
        // Move the accessed node to the front (most recent)
        list.moveToFront(node);
        return node.value;
    }

    /**
     * Inserts or updates a key/value pair.
     *
     * @param key   the key
     * @param value the value
     */
    public void put(K key, V value) {
        Node<K, V> node = map.get(key);
        if (node != null) {
            // Update existing node and move to front
            node.value = value;
            list.moveToFront(node);
        } else {
            // New entry
            if (map.size() >= capacity) {
                // Evict least recently used (tail)
                Node<K, V> lru = list.removeTail();
                if (lru != null) {
                    map.remove(lru.key);
                }
            }
            Node<K, V> newNode = new Node<>(key, value);
            list.addFirst(newNode);
            map.put(key, newNode);
        }
    }

    /**
     * Returns the current number of entries in the cache.
     */
    public int size() {
        return map.size();
    }

    // Internal node class
    private static class Node<K, V> {
        K key;
        V value;
        Node<K, V> prev;
        Node<K, V> next;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    // Internal doubly linked list to track usage order
    private static class DoublyLinkedList<K, V> {
        private Node<K, V> head; // most recent
        private Node<K, V> tail; // least recent

        void addFirst(Node<K, V> node) {
            node.next = head;
            node.prev = null;
            if (head != null) {
                head.prev = node;
            }
            head = node;
            if (tail == null) {
                tail = node;
            }
        }

        void moveToFront(Node<K, V> node) {
            if (node == head) {
                return; // already most recent
            }
            // detach
            if (node.prev != null) {
                node.prev.next = node.next;
            }
            if (node.next != null) {
                node.next.prev = node.prev;
            }
            if (node == tail) {
                tail = node.prev;
            }
            // insert at front
            node.prev = null;
            node.next = head;
            if (head != null) {
                head.prev = node;
            }
            head = node;
            if (tail == null) {
                tail = node;
            }
        }

        Node<K, V> removeTail() {
            if (tail == null) {
                return null;
            }
            Node<K, V> oldTail = tail;
            if (tail.prev != null) {
                tail = tail.prev;
                tail.next = null;
            } else {
                // only one element
                head = tail = null;
            }
            oldTail.prev = oldTail.next = null;
            return oldTail;
        }
    }
}
