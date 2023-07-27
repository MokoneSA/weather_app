import React from 'react'

const NewsItem = ({item}) => {
    const websiteUrl = item.url
    const website = websiteUrl.split('https://').pop().split('/')[0]

    const date = item.publishedAt
    const formatDate = date.replace('T', '')
    const formatTime = formatDate.replace('Z', '')
    return (
        <a href='' className='article'>
            <div className="article-image">
                <img src={item.urlToImage} alt={item.title} />
            </div>
            <div className="article-content">
                <div className="article-source">
                    <img src="" alt="" />
                    <span>{item.source.name}</span>
                </div>
                <div className="article-title">
                    <h2>{item.title}</h2>
                </div>
                <div className="article-description">
                    <p>{item.description}</p>
                </div>
                <div className="article-details">
                    <small><b>Published At:</b>{formatTime}</small>
                </div>
            </div>
        </a>
    )
}

export default NewsItem