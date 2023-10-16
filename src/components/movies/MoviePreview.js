function MoviePreview({data}){
    return <div>
        <div>{data.title}</div>
        <img src={data.image} width="100%" alt="asdf"/>
    </div>
}

export default MoviePreview;