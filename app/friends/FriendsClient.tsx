"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./friends.module.css";

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}

interface GroupMember {
  id: string;
  role: "owner" | "member";
  joined_at: string;
  user: User;
}

interface MyGroup {
  membership_id: string;
  group_id: string;
  joined_at: string;
  owner: User;
}

interface FriendsClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function FriendsClient({ user }: FriendsClientProps) {
  const router = useRouter();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch group members
      const membersResponse = await fetch("/api/groups/members");
      const membersData = await membersResponse.json();

      if (membersData.success) {
        setMembers(membersData.members || []);
      }

      // Fetch groups user is a member of
      const groupsResponse = await fetch("/api/groups/my-groups");
      const groupsData = await groupsResponse.json();

      if (groupsData.success) {
        setMyGroups(groupsData.groups || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (
      !confirm(
        `Are you sure you want to remove ${memberName} from your friends?`
      )
    ) {
      return;
    }

    setRemovingMemberId(memberId);
    try {
      const response = await fetch("/api/groups/remove-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setMembers(members.filter((m) => m.id !== memberId));
      } else {
        alert(data.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("An error occurred while removing the member");
    } finally {
      setRemovingMemberId(null);
    }
  };

  const handleLeaveGroup = async (membershipId: string, ownerName: string) => {
    if (
      !confirm(`Are you sure you want to leave ${ownerName}'s friends group?`)
    ) {
      return;
    }

    setLeavingGroupId(membershipId);
    try {
      const response = await fetch("/api/groups/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membership_id: membershipId }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setMyGroups(myGroups.filter((g) => g.membership_id !== membershipId));
      } else {
        alert(data.error || "Failed to leave group");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("An error occurred while leaving the group");
    } finally {
      setLeavingGroupId(null);
    }
  };

  const handleGenerateInvite = async () => {
    setIsGeneratingInvite(true);

    try {
      const response = await fetch("/api/invitations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.success && data.invite_url) {
        setInviteUrl(data.invite_url);
      } else {
        alert(data.error || "Failed to generate invite link");
      }
    } catch (error) {
      console.error("Error generating invite:", error);
      alert("An error occurred while generating the invite link");
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    alert("Invite link copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push("/dashboard")}>
          <span>🎯</span>
          <span>Bingoooal</span>
        </div>
        <div className={styles.userInfo}>
          {user.image && (
            <img
              src={user.image}
              alt={user.name || ""}
              className={styles.userAvatar}
            />
          )}
          <span className={styles.userName}>{user.name || user.email}</span>
          <button
            onClick={() => setShowInviteModal(true)}
            className={styles.inviteUserBtn}
          >
            Invite User
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.backButton}>
          <button
            onClick={() => router.push("/dashboard")}
            className={styles.backBtn}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Friends</h1>

          {isLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <>
              {/* My Friends Group */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span>👥</span> My Friends (
                  {members.filter((m) => m.role !== "owner").length})
                </h2>
                <p className={styles.sectionDescription}>
                  People you've invited to join your friends group
                </p>

                {members.filter((m) => m.role !== "owner").length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👋</div>
                    <p>No friends yet. Invite someone to get started!</p>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className={styles.inviteBtn}
                    >
                      Invite User
                    </button>
                  </div>
                ) : (
                  <div className={styles.membersList}>
                    {members
                      .filter((member) => member.role !== "owner")
                      .map((member) => (
                        <div key={member.id} className={styles.memberCard}>
                          <div className={styles.memberInfo}>
                            {member.user.avatar_url && (
                              <img
                                src={member.user.avatar_url}
                                alt={member.user.name || ""}
                                className={styles.memberAvatar}
                              />
                            )}
                            <div className={styles.memberDetails}>
                              <div className={styles.memberName}>
                                {member.user.name || member.user.email}
                              </div>
                              <div className={styles.memberMeta}>
                                <span className={styles.joinedDate}>
                                  Joined {formatDate(member.joined_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveMember(
                                member.id,
                                member.user.name || member.user.email
                              )
                            }
                            disabled={removingMemberId === member.id}
                            className={styles.removeBtn}
                          >
                            {removingMemberId === member.id
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              {/* Groups I'm In */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span>🤝</span> Groups I'm In ({myGroups.length})
                </h2>
                <p className={styles.sectionDescription}>
                  Friends groups you've joined
                </p>

                {myGroups.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔗</div>
                    <p>You haven't joined any friends groups yet.</p>
                  </div>
                ) : (
                  <div className={styles.membersList}>
                    {myGroups.map((group) => (
                      <div
                        key={group.membership_id}
                        className={styles.memberCard}
                      >
                        <div className={styles.memberInfo}>
                          {group.owner.avatar_url && (
                            <img
                              src={group.owner.avatar_url}
                              alt={group.owner.name || ""}
                              className={styles.memberAvatar}
                            />
                          )}
                          <div className={styles.memberDetails}>
                            <div className={styles.memberName}>
                              {group.owner.name || group.owner.email}'s Friends
                            </div>
                            <div className={styles.memberMeta}>
                              <span className={styles.joinedDate}>
                                Joined {formatDate(group.joined_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleLeaveGroup(
                              group.membership_id,
                              group.owner.name || group.owner.email
                            )
                          }
                          disabled={leavingGroupId === group.membership_id}
                          className={styles.leaveBtn}
                        >
                          {leavingGroupId === group.membership_id
                            ? "Leaving..."
                            : "Leave"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div
          className={styles.modal}
          onClick={() => {
            setShowInviteModal(false);
            setInviteUrl("");
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Invite User to Bingoooal</h2>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteUrl("");
                }}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>

            {!inviteUrl ? (
              <div className={styles.inviteContent}>
                <p className={styles.inviteDescription}>
                  Generate an invite link to share with someone you'd like to
                  invite to the platform. They'll be able to sign up and start
                  tracking their goals!
                </p>
                <button
                  onClick={handleGenerateInvite}
                  className={styles.generateInviteBtn}
                  disabled={isGeneratingInvite}
                >
                  {isGeneratingInvite
                    ? "Generating..."
                    : "Generate Invite Link"}
                </button>
              </div>
            ) : (
              <div className={styles.inviteContent}>
                <p className={styles.inviteDescription}>
                  Share this link with the person you want to invite:
                </p>
                <div className={styles.inviteLinkContainer}>
                  <input
                    type="text"
                    value={inviteUrl}
                    readOnly
                    className={styles.inviteLinkInput}
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className={styles.copyBtn}
                  >
                    📋 Copy
                  </button>
                </div>
                <p className={styles.inviteNote}>
                  This link will expire in 30 days and can only be used once.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
