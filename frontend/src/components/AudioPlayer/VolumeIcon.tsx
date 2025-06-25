interface Props {
    volume: number;
}

const VolumeIcon = (props: Props) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            {props.volume > 0 && (
                <>
                    <path d="M15 8a5 5 0 0 1 0 8"/>
                    {props.volume > 0.5 && <path d="M18 5a9 9 0 0 1 0 14"/>}
                </>
            )}
        </svg>
    );
};

export default VolumeIcon;