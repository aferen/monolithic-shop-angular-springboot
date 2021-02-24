package com.mycompany.shop.springbootshop.domain;

import java.io.Serializable;
import java.util.Arrays;
import javax.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "products")
public class Product implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@NotNull
	@Field("name")
	private String name;

	@NotNull
	@Field("description")
	private String description;

	@Field("date")
	private String date;

	@Field("price")
	private int price;

	@Field("priceNormal")
	private int priceNormal;

	@Field("reduction")
	private int reduction;

	@Field("imageNames")
	private String[] imageNames;

	private String[] imageURLs;

	@Field("categories")
	private Object categories;

	@Field("ratings")
	private Object ratings;

	@Field("currentRating")
	private int currentRating;

	@Field("sale")
	private boolean sale;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public int getPriceNormal() {
		return priceNormal;
	}

	public void setPriceNormal(int priceNormal) {
		this.priceNormal = priceNormal;
	}

	public int getReduction() {
		return reduction;
	}

	public void setReduction(int reduction) {
		this.reduction = reduction;
	}

	public String[] getImageNames() {
		return imageNames;
	}

	public void setImageNames(String[] imageNames) {
		this.imageNames = imageNames;
	}
	
	//TODO: url'yi yml'den oku
	public String[] getImageURLs() {
		this.imageURLs = new String[this.imageNames.length];
		for (int i = 0; i < this.imageNames.length; i++) {
			this.imageURLs[i] = "http://localhost:8080/api/images/products/" + this.imageNames[i];
		}
       	return this.imageURLs;
	}

	public Object getCategories() {
		return categories;
	}

	public void setCategories(Object categories) {
		this.categories = categories;
	}

	public Object getRatings() {
		return ratings;
	}

	public void setRatings(Object ratings) {
		this.ratings = ratings;
	}

	public int getCurrentRating() {
		return currentRating;
	}

	public void setCurrentRating(int currentRating) {
		this.currentRating = currentRating;
	}

	public boolean isSale() {
		return sale;
	}

	public void setSale(boolean sale) {
		this.sale = sale;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Product other = (Product) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", description=" + description + ", date=" + date
				+ ", priceNormal=" + priceNormal + ", reduction=" + reduction + ", imageNames="
				+ Arrays.toString(imageNames) + ", categories=" + categories + ", ratings=" + ratings
				+ ", currentRating=" + currentRating + ", sale=" + sale + "]";
	}

}
