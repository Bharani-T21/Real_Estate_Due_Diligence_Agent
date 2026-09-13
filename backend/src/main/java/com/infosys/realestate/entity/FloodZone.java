package com.infosys.realestate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "flood_zones")
public class FloodZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    private Property property;

    @Column(nullable = false)
    private String zone;

    private Double baseFloodElevation;

    private Boolean insuranceRequired;

    private String nearestWaterBody;

    private Double distanceToWaterBody;

    private String femaPanel;

    public FloodZone() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
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