import { useState } from "react";
import "./TagInput.css";

interface Props {
  tags: string[];
  setTags: (tags: string[]) => void;
  possibleTags: string[] | undefined;
}

const TagInput = ({ tags, setTags, possibleTags }: Props) => {
    const [showSelector, setShowSelector] = useState<boolean>(false);

    const removeTag = (tagToDelete: string) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    const addTag = (tagToAdd: string) => {
        const trimmed = tagToAdd.trim();

        if (
            trimmed &&
      possibleTags &&
      !tags.includes(trimmed) &&
      possibleTags.includes(trimmed)
        ) {
            setTags([...tags, trimmed]);
        }

        setShowSelector(false);
    };

    const availableTags =
    possibleTags?.filter((tag) => !tags.includes(tag)) || [];

    return (
        <div className="tag-input-container">
            <div className="tag-list">
                {tags.map((tag) => (
                    <div className="tag-item" key={tag}>
                        <span>{tag}</span>
                        <button
                            className="remove-tag-button"
                            onClick={() => removeTag(tag)}
                        >
              X
                        </button>
                    </div>
                ))}
                <button
                    className="add-tag-button"
                    onClick={() => setShowSelector(!showSelector)}
                >
          +
                </button>
            </div>

            {showSelector && (
                <div className="tag-dropdown">
                    {availableTags.map((tag) => (
                        <div
                            className="dropdown-item"
                            key={tag}
                            onClick={() => addTag(tag)}
                        >
                            {tag}
                        </div>
                    ))}
                    {availableTags.length === 0 && (
                        <div className="dropdown-empty">No more tags</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TagInput;
