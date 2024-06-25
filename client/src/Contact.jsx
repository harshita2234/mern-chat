import Avatar from "./Avatar";

export default function Contact({id,username,onClick,selected,online}){
    return(
        <div key={id} onClick={()=>onClick(id)} className={"border-b border-grey-100 flex items-center gap-2 cursor-pointer "+(id === selected ? 'bg-blue-50' : '')}>
            {selected && (
                <div className="w-1 bg-blue-500 h-14"></div>
            )}
            <div className="flex items-center gap-2 pl-4 py-2">
                <Avatar online={online} username={username} userId={id}/>
                <span className="text-gray-800">{username}</span>
            </div>
        </div>
    )
}