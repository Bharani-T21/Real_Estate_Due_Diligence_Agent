package com.infosys.realestate.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "flood_zone_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FloodZoneInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String propertyId;
    private String zoneDesignation;
    private String riskLevel;
    private Boolean insuranceRequired;
}
