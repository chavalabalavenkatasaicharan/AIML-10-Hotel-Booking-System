package com.bellhaven.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bellhaven.backend.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findAllByOrderByDisplayOrderAsc();

    Optional<Room> findByNameIgnoreCase(String name);
}