package com.infosys.realestate.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "zoning_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZoningInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String propertyId;
    private String zoneType;
    private String permittedUses;
    private String compliance;
    private LocalDate lastReviewDate;
}
