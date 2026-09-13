package com.infosys.realestate.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZoningInfoDTO {
    private String propertyId;
    private String zoneType;
    private String permittedUses;
    private String compliance;
    private LocalDate lastReviewDate;
}
