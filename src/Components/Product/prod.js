 <section className="pt-[5px] md:pt-[10px] w-full ">
        {/* All prioduct */}
        <div className="productContainer " >
          {allProduct.map((item) => (
            <Link
              key={item._id}
              to={`/product/${slugify(item.productTitle)}/${
                item.productCategory
              }/${item._id}`}
            >
              <form
                className="product border border-gray-200 md:w-1/5"
                // onClick={() => setViewId(item._id)}
                onClick={handleSubmit}
              >
                <div className="productImg rounded-xl">
                  <img
                    src={item.productImg}
                    alt={item.productTitle}
                    className="rounded-xl"
                  />

                  {availInCart(item._id) <= 0 ? (
                    <button
                      type="submit"
                      className="add-item-btn"
                      // onClick={(e) => addCart(e, item)}
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="add-item-btn gap-2 text-xl">
                      <button
                        type="submit"
                        className="text-[16px] text-green-400 text-xl"
                        onClick={(e) => addCart(e, item)}
                      >
                        +
                      </button>
                      <p>{availInCart(item._id)}</p>
                      <button className="text-red-400 text-xl">-</button>
                    </div>
                  )}
                </div>
                <div className="productDetails">
                  <p>
                    <span>₹ </span>
                    {item.productPrice}
                  </p>
                  <p>1 Pair</p>
                  <p>
                    <strong className="text-clamp">{item.productTitle}</strong>
                  </p>
                </div>
              </form>
            </Link>
          ))}
        </div>
      </section> 