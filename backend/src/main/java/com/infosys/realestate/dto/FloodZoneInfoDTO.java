package com.infosys.realestate.dto;

public class FloodZoneInfoDTO {
    private Long propertyId;
    private String zoneDesignation;
    private String riskLevel;
    private boolean insuranceRequired;

    public FloodZoneInfoDTO(Long propertyId, String zoneDesignation, String riskLevel, boolean insuranceRequired) {
        this.propertyId = propertyId;
        this.zoneDesignation = zoneDesignation;
        this.riskLevel = riskLevel;
        this.insuranceRequired = insuranceRequired;
    }
    // Getters and Setters
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
    public String getZoneDesignation() { return zoneDesignation; }
    public void setZoneDesignation(String zoneDesignation) { this.zoneDesignation = zoneDesignation; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public boolean isInsuranceRequired() { return insuranceRequired; }
    public void setInsuranceRequired(boolean insuranceRequired) { this.insuranceRequired = insuranceRequired; }
}
