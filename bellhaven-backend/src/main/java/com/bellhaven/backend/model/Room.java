package com.bellhaven.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Integer price;

    @Column(length = 1000)
    private String description;

    private String image;

    // Controls the order rooms are returned in, and which ones show up
    // first when the frontend asks for a "preview" (e.g. Home page).
    @Column(name = "display_order")
    private Integer displayOrder;

    // How many physical rooms of this type the hotel has. Used to work
    // out availability: totalRooms minus bookings whose stay overlaps
    // the requested date range.
    @Column(name = "total_rooms", nullable = false)
    private Integer totalRooms;

    public Room() {
    }

    public Room(String name, Integer price, String description, String image, Integer displayOrder,
                Integer totalRooms) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.image = image;
        this.displayOrder = displayOrder;
        this.totalRooms = totalRooms;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Integer totalRooms) {
        this.totalRooms = totalRooms;
    }
}