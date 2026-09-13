package com.infosys.realestate.dto;

public class FloodZoneRequest {

    private Long propertyId;
    private String zone;
    private Double baseFloodElevation;
    private Boolean insuranceRequired;
    private String nearestWaterBody;
    private Double distanceToWaterBody;
    private String femaPanel;

    public FloodZoneRequest() {}

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public Double getBaseFloodElevation() {
        return baseFloodElevation;
    }

    public void setBaseFloodElevation(Double baseFloodElevation) {
        this.baseFloodElevation = baseFloodElevation;
    }

    public Boolean getInsuranceRequired() {
        return insuranceRequired;
    }

    public void setInsuranceRequired(Boolean insuranceRequired) {
        this.insuranceRequired = insuranceRequired;
    }

    public String getNearestWaterBody() {
        return nearestWaterBody;
    }

    public void setNearestWaterBody(String nearestWaterBody) {
        this.nearestWaterBody = nearestWaterBody;
    }

    public Double getDistanceToWaterBody() {
        return distanceToWaterBody;
    }

    public void setDistanceToWaterBody(Double distanceToWaterBody) {
        this.distanceToWaterBody = distanceToWaterBody;
    }

    public String getFemaPanel() {
        return femaPanel;
    }

    public void setFemaPanel(String femaPanel) {
        this.femaPanel = femaPanel;
    }
}