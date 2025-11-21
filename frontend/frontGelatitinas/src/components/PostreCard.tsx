import React from 'react';

const PostreCard: React.FC<{ p: any }> = ({ p }) => {
  return (
    <div className="dessert-card" style={{ maxWidth: 360 }}>
      <div className="image-container">
        <img src={p.image} alt={p.name} style={{ width:'100%', height:200, objectFit:'cover' }} />
      </div>
      <div className="dessert-content">
        <div className="dessert-header">
          <div style={{ flex: 1 }}>
            <h3 className="dessert-title">{p.name}</h3>
            <div className="category-badge">{p.category}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="dessert-price">${p.price}</div>
          </div>
        </div>
        <p className="dessert-description">{p.description}</p>

        <a
          className="whatsapp-btn"
          href="https://wa.me/+524951332347?text=Hola%20quiero%20comprar%20este%20producto"
          target="_blank"
          rel="noreferrer"
        >
          Preguntar por WhatsApp
        </a>
      </div>
    </div>
  );
};

export default PostreCard;
