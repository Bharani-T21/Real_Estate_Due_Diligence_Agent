package com.infosys.realestate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "zoning")
public class Zoning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zoning_id")
    private Long zoningId;

    @OneToOne
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    private Property property;

    @Column(name = "zoning_category")
    private String zoningCategory;

    @Column(name = "zoning_class")
    private String zoningClass;

    @Column(name = "planning_authority")
    private String planningAuthority;

    @Column(name = "master_plan")
    private String masterPlan;

    @Column(name = "parcel_identifier")
    private String parcelIdentifier;

    @Column(name = "compliance_status")
    private String complianceStatus;

    @Column(name = "max_far")
    private Double maxFar;

    @Column(name = "max_height")
    private String maxHeight;

    @Column(name = "ground_coverage")
    private String groundCoverage;

    @Column(name = "min_plot_area")
    private String minPlotArea;

    @Column(name = "front_setback")
    private String frontSetback;

    @Column(name = "rear_setback")
    private String rearSetback;

    @Column(name = "left_setback")
    private String leftSetback;

    @Column(name = "right_setback")
    private String rightSetback;

    @Column(name = "permitted_usage", columnDefinition = "TEXT")
    private String permittedUsage;

    @Column(name = "restricted_usage", columnDefinition = "TEXT")
    private String restrictedUsage;

    @Column(name = "special_regulations", columnDefinition = "TEXT")
    private String specialRegulations;

    public Long getZoningId() {
        return zoningId;
    }

    public void setZoningId(Long zoningId) {
        this.zoningId = zoningId;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public String getZoningCategory() {
        return zoningCategory;
    }

    public void setZoningCategory(String zoningCategory) {
        this.zoningCategory = zoningCategory;
    }

    public String getZoningClass() {
        return zoningClass;
    }

    public void setZoningClass(String zoningClass) {
        this.zoningClass = zoningClass;
    }

    public String getPlanningAuthority() {
        return planningAuthority;
    }

    public void setPlanningAuthority(String planningAuthority) {
        this.planningAuthority = planningAuthority;
    }

    public String getMasterPlan() {
        return masterPlan;
    }

    public void setMasterPlan(String masterPlan) {
        this.masterPlan = masterPlan;
    }

    public String getParcelIdentifier() {
        return parcelIdentifier;
    }

    public void setParcelIdentifier(String parcelIdentifier) {
        this.parcelIdentifier = parcelIdentifier;
    }

    public String getComplianceStatus() {
        return complianceStatus;
    }

    public void setComplianceStatus(String complianceStatus) {
        this.complianceStatus = complianceStatus;
    }

    public Double getMaxFar() {
        return maxFar;
    }

    public void setMaxFar(Double maxFar) {
        this.maxFar = maxFar;
    }

    public String getMaxHeight() {
        return maxHeight;
    }

    public void setMaxHeight(String maxHeight) {
        this.maxHeight = maxHeight;
    }

    public String getGroundCoverage() {
        return groundCoverage;
    }

    public void setGroundCoverage(String groundCoverage) {
        this.groundCoverage = groundCoverage;
    }

    public String getMinPlotArea() {
        return minPlotArea;
    }

    public void setMinPlotArea(String minPlotArea) {
        this.minPlotArea = minPlotArea;
    }

    public String getFrontSetback() {
        return frontSetback;
    }

    public void setFrontSetback(String frontSetback) {
        this.frontSetback = frontSetback;
    }

    public String getRearSetback() {
        return rearSetback;
    }

    public void setRearSetback(String rearSetback) {
        this.rearSetback = rearSetback;
    }

    public String getLeftSetback() {
        return leftSetback;
    }

    public void setLeftSetback(String leftSetback) {
        this.leftSetback = leftSetback;
    }

    public String getRightSetback() {
        return rightSetback;
    }

    public void setRightSetback(String rightSetback) {
        this.rightSetback = rightSetback;
    }

    public String getPermittedUsage() {
        return permittedUsage;
    }

    public void setPermittedUsage(String permittedUsage) {
        this.permittedUsage = permittedUsage;
    }

    public String getRestrictedUsage() {
        return restrictedUsage;
    }

    public void setRestrictedUsage(String restrictedUsage) {
        this.restrictedUsage = restrictedUsage;
    }

    public String getSpecialRegulations() {
        return specialRegulations;
    }

    public void setSpecialRegulations(String specialRegulations) {
        this.specialRegulations = specialRegulations;
    }
}